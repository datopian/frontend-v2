'use strict'

const express = require('express')


module.exports = function () {
  const router = express.Router()

  router.get('/about', async (req, res) => {
    res.render('about.html', {
      title: 'About'
    })
  })

  return router
}
