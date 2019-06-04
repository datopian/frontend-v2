'use strict'

const express = require('express')

const config = require('../config')
const dms = require('../lib/dms')


module.exports = function () {
  const router = express.Router()
  const Model = new dms.DmsModel(config)

  router.get('/', async (req, res) => {
    res.render('home.html', {
      title: 'Home'
    })
  })

  router.get('/search', async (req, res) => {
    const query = Object.entries(req.query).map(e => e.join('=')).join('&')
    const result = await Model.search(query)
    const packages = JSON.parse(JSON.stringify(result.results))
    delete result.results
    res.render('search.html', {
      title: 'Search',
      result,
      packages
    })
  })

  return router
}
