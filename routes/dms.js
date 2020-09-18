'use strict'
const querystring = require('querystring')
const express = require('express')

const config = require('../config')
const dms = require('../lib/dms')
const utils = require('../utils')
const { URL } = require('url')
const https = require("https")
const http = require("http")
const { callbackPromise } = require('nodemailer/lib/shared')
const logger = require('../utils/logger')
module.exports = function () {
  const router = express.Router()
  const Model = new dms.DmsModel(config)

  // -----------------------------------------------
  // Redirects

  router.get('/dataset', (req, res) => {
    let destination = '/search'
    const query = querystring.stringify(req.query)
    if (query) {
      destination += `?${query}`
    }
    res.redirect(301, destination)
  })

  router.get('/dataset/:name', async (req, res, next) => {
    // Identify owner org name
    let datapackage = await Model.getPackage(req.params.name)

    const destination = `/${datapackage.organization.name}/${datapackage.name}`
    res.redirect(301, destination)
  })

  router.get('/dataset/:name/resource/:id', async (req, res, next) => {
    // Identify owner org name
    let datapackage = await Model.getPackage(req.params.name)

    const resourceName = datapackage.resources
      .find(resource => resource.id === req.params.id)
      .name

    const destination = `/${datapackage.organization.name}/${datapackage.name}#resource-${resourceName.replace('.', '_')}`

    res.redirect(301, destination)
  })

  router.get('/organization/:owner', (req, res) => {
    const destination = '/' + req.params.owner
    res.redirect(301, destination)
  })

  router.get('/group', (req, res) => {
    res.redirect(301, '/collections')
  })

  router.get('/group/:collection', (req, res) => {
    const destination = '/collections/' + req.params.collection
    res.redirect(301, destination)
  })

  // End of redirects
  // -----------------------------------------------

  router.get('/', async (req, res) => {
    // If no CMS is enabled, show home page without posts
    res.render('home.html', {
      title: 'Home'
    })
  })

  router.get(config.get('WP_BLOG_PATH'), async (req, res) => {
    res.render('blog.html', {
      title: 'Home'
    })
  })

  router.get('/search', async (req, res, next) => {
    const result = await Model.search(req.query)
    // Pagination
    const from = req.query.from || 0
    const size = req.query.size || 10
    const total = result.count
    const totalPages = Math.ceil(total / size)
    const currentPage = parseInt(from, 10) / size + 1
    const pages = utils.pagination(currentPage, totalPages)

    res.render('search.html', {
      title: 'Search',
      result,
      query: req.query,
      totalPages,
      pages,
      currentPage
    })
  })

  router.get('/collections', async (req, res, next) => {
    const collections = await Model.getCollections()
    res.render('collections-home.html', {
      title: 'Dataset Collections',
      description: 'Catalogue of datasets for a particular project or team, or on a particular theme, or as a very simple way to help people find and search your own published datasets.',
      collections,
      slug: 'collections'
    })
  })

  router.get('/collections/:collectionName', async (req, res) => {
    // Get collection details
    const name = req.params.collectionName
    const collection = await Model.getCollection(name)
    // Get datasets for this collection
    if (req.query.q) {
      req.query.q += ` groups:${name}`
    } else {
      req.query.q = `groups:${name}`
    }
    const result = await Model.search(req.query)
    // Pagination
    const from = req.query.from || 0
    const size = req.query.size || 10
    const total = result.count
    const totalPages = Math.ceil(total / size)
    const currentPage = parseInt(from, 10) / size + 1
    const pages = utils.pagination(currentPage, totalPages)
    res.render('collection.html', {
      title: collection.title, // needed because this is used in base.html
      item: collection,
      result,
      query: req.query,
      totalPages,
      pages,
      currentPage
    })
  })

  router.get('/:owner/:name', async (req, res, next) => {
    let datapackage = res.locals.datapackage || null

    datapackage = await prepareDataPackageForRender(req.params.name, datapackage)

    const profile = await Model.getProfile(req.params.owner)
    res.render('showcase.html', {
      title: req.params.owner + ' | ' + req.params.name,
      dataset: datapackage,
      owner: {
        name: profile.name,
        title: profile.title,
        description: utils.processMarkdown.render(profile.description),
        avatar: profile.image_display_url || profile.image_url
      },
      thisPageFullUrl: '//' + req.get('host') + req.originalUrl,
      dpId: JSON.stringify(datapackage).replace(/'/g, "&#x27;") // keep for backwards compat?
    })
  })

  router.get('/:owner/:name/datapackage.json', async (req, res, next) => {
    let datapackage = res.locals.datapackage || null
    datapackage = await prepareDataPackageForRender(req.params.name, datapackage)

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.end(JSON.stringify(datapackage))
  })

  async function prepareDataPackageForRender(name, datapackage) {
    if (!datapackage) {
      datapackage = await Model.getPackage(name)
    }

    // Prepare datapackage for display, eg, process markdown, convert values to
    // human-readable format etc.:
    datapackage = utils.processDataPackage(datapackage)

    // Prepare resources for display (preview):
    datapackage = utils.prepareResourcesForDisplay(datapackage)

    // Since "datapackage-views-js" library renders views according to
    // descriptor's "views" property, we need to generate view objects.
    // Note that we have "views" per resources so here we will consolidate them.
    datapackage = utils.prepareViews(datapackage)

    // Data Explorer used a slightly different spec than "datapackage-views-js":
    datapackage = utils.prepareDataExplorers(datapackage)

    // Prep text views - load first 10Kb of a file to 'content' attribut which
    // we can render as is in the template.
    datapackage.displayResources = await Promise.all(datapackage.displayResources.map(async item => {
      await Promise.all(item.resource.views.map(async (view, index) => {
        if (view && view.specType === 'text' && item.resource.path) {
          item.resource.views[index].content = await fetchTextContent(item.resource.path)
        }
      }))
      return item
    }))

    return datapackage
  }


  function fetchTextContent(url) {
    let newURL = new URL(url)
    let protocol = https
    return new Promise((resolve, reject) => {
      if (newURL.protocol == 'http:') {
        protocol = http
      }
      protocol.get(newURL, (res, error) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          https.get(res.headers.location, (res, error) => {
            let buff = new Buffer(0)
            res.on('data', (chunk) => {
              buff = Buffer.concat([buff, chunk])
              if (buff.length > 10240) {
                res.destroy()
                resolve(buff.toString())
              }
            })
            res.on('end', () => {
              resolve(buff.toString())
            })
          }).on('error', (e) => {
            logger.error(e)
          })
        } else {
          let buff = new Buffer(0)
          res.on('data', (chunk) => {
            buff = Buffer.concat([buff, chunk])
            if (buff.length > 10240) {
              res.destroy()
              resolve(buff.toString())
            }
          })
          res.on('end', () => {
            resolve(buff.toString())
          })
        }
      }).on('error', (e) => {
        logger.error(e)
      })
    })
  }

  router.get('/organization', async (req, res, next) => {
    const collections = await Model.getOrganizations()
    res.render('collections-home.html', {
      title: 'Organizations',
      description: 'CKAN Organizations are used to create, manage and publish collections of datasets. Users can have different roles within an Organization, depending on their level of authorisation to create, edit and publish.',
      collections,
      slug: 'organization'
    })
  })

  // MUST come last in order to catch all the publisher pages
  router.get('/:owner', async (req, res, next) => {
    // Get owner details
    const owner = req.params.owner
    const profile = await Model.getProfile(owner)
    // if not a valid profile, send them on the way
    if (!profile.created) {
      return res.status(404).render('404.html', {
        message: `Page found: ${owner}`,
        status: 404
      })
    }
    const created = new Date(profile.created)
    const joinYear = created.getUTCFullYear()
    const joinMonth = created.toLocaleString('en-us', { month: "long" })
    // Get datasets for this owner
    if (req.query.q) {
      req.query.q += ` organization:${owner}`
    } else {
      req.query.q = `organization:${owner}`
    }
    const result = await Model.search(req.query)
    // Pagination
    const from = req.query.from || 0
    const size = req.query.size || 10
    const total = result.count
    const totalPages = Math.ceil(total / size)
    const currentPage = parseInt(from, 10) / size + 1
    const pages = utils.pagination(currentPage, totalPages)

    res.render('owner.html', {
      title: profile.title,
      owner: {
        name: profile.name,
        title: profile.title,
        description: utils.processMarkdown.render(profile.description),
        avatar: profile.image_display_url || profile.image_url,
        joinDate: joinMonth + ' ' + joinYear,
      },
      result,
      query: req.query,
      totalPages,
      pages,
      currentPage
    })
  })

  return router
}
