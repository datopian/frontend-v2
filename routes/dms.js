'use strict'

const express = require('express')

const config = require('../config')
const dms = require('../lib/dms')
const utils = require('../utils')


module.exports = function () {
  const router = express.Router()
  const Model = new dms.DmsModel(config)

  // -----------------------------------------------
  // Redirects

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
    res.render('home.html', {
      title: 'Home'
    })
  })

  router.get('/search', async (req, res, next) => {
    try {
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
        query: req.query ? req.query.q : '',
        totalPages,
        pages
      })
    } catch (e) {
      next(e)
    }
  })

  router.get('/collections', async (req, res) => {
    const collections = await Model.getCollections()
    res.render('collections-home.html', {
      title: 'Dataset Collections',
      description: 'Catalogue of datasets for a particular project or team, or on a particular theme, or as a very simple way to help people find and search your own published datasets.',
      collections
    })
  })

  router.get('/collections/:collectionName', async (req, res) => {
    // Get collection details
    const name = req.params.collectionName
    const collection = await Model.getCollection(name)

    // Get datasets for this collection
    const currentPage = req.query.page || 1
    req.query.start = (currentPage - 1) * 10
    delete req.query.page
    const query = `fq=groups:${name}`
    const searchResponse = await Model.search(query)
    const packages = JSON.parse(JSON.stringify(searchResponse.results))
    delete searchResponse.results
    const totalPages = Math.ceil(searchResponse.count / 10)
    const pages = utils.pagination(currentPage, totalPages)

    res.render('collection.html', {
      title: collection.title, // needed because this is used in base.html
      item: collection,
      result: searchResponse,
      packages,
      query: req.query ? req.query.q : '',
      totalPages,
      pages
    })
  })

  router.get('/:owner/:name', async (req, res, next) => {
    let datapackage = null

    try {
      datapackage = await Model.getPackage(req.params.name)
    } catch (err) {
      next(err)
      return
    }

    // Since "frontend-showcase-js" library renders views according to
    // descriptor's "views" property, we need to include "preview" views:
    datapackage.views = datapackage.views || []
    datapackage.resources.forEach(resource => {
      const view = {
        datahub: {
          type: 'preview'
        },
        resources: [
           resource.name
        ],
        specType: 'table'
      }
      datapackage.views.push(view)
    })

    res.render('showcase.html', {
      title: req.params.owner + ' | ' + req.params.name,
      dataset: datapackage,
      owner: req.params.owner,
      dpId: JSON.stringify(datapackage).replace(/\\/g, '\\\\').replace(/\'/g, "\\'")
    })
  })

  // MUST come last in order to catch all the publisher pages
  router.get('/:owner', async (req, res) => {
    // Get owner details
    const owner = req.params.owner
    const profile = await Model.getProfile(owner)
    const created = new Date(profile.created)
    const joinYear = created.getUTCFullYear()
    const joinMonth = created.toLocaleString('en-us', { month: "long" })
    // Get owner's list of datasets
    const currentPage = req.query.page || 1
    req.query.start = (currentPage - 1) * 10
    delete req.query.page
    const query = `fq=organization:${owner}`
    const searchResponse = await Model.search(query)
    const packages = JSON.parse(JSON.stringify(searchResponse.results))
    delete searchResponse.results
    const totalPages = Math.ceil(searchResponse.count / 10)
    const pages = utils.pagination(currentPage, totalPages)

    res.render('owner.html', {
      title: owner,
      owner,
      description: profile.description,
      avatar: profile.image_display_url || profile.image_url,
      joinDate: joinMonth + ' ' + joinYear,
      result: searchResponse,
      packages,
      query: req.query ? req.query.q : '',
      totalPages,
      pages
    })
  })

  return router
}
