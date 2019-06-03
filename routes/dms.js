'use strict'

const express = require('express')


module.exports = function () {
  const router = express.Router()

  router.get('/', async (req, res) => {
    res.render('home.html', {
      title: 'Home'
    })
  })

  return router
}
