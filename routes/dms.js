'use strict'

const express = require('express')

const config = require('../config')
const dms = require('../lib/dms')
const utils = require('../utils')


module.exports = function () {
  const router = express.Router()
  const Model = new dms.DmsModel(config)

  router.get('/', async (req, res) => {
    res.render('home.html', {
      title: 'Home'
    })
  })

  router.get('/search', async (req, res) => {
    // For pagination we need to convert 'page' into 'start' param:
    const currentPage = req.query.page || 1
    req.query.start = (currentPage - 1) * 10
    delete req.query.page
    const query = Object.entries(req.query).map(e => e.join('=')).join('&')
    const result = await Model.search(query)
    const packages = JSON.parse(JSON.stringify(result.results))
    delete result.results
    const totalPages = Math.ceil(result.count / 10)
    const pages = utils.pagination(currentPage, totalPages)
    res.render('search.html', {
      title: 'Search',
      result,
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

  return router
}
