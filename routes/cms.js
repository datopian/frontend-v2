'use strict'

const express = require('express')
const moment = require('moment')

const cms = require('../lib/cms')


module.exports = function () {
  const router = express.Router()
  const Model = new cms.CmsModel()

  router.get('/news', listStaticPages)
  router.get(['/news/:page', '/:page', '/:parent/:page'], showStaticPage)

  async function listStaticPages(req, res) {
    // Get latest 10 blog posts
    const size = 10
    const posts = await Model.getListOfPosts(size)
    res.render('blog.html', {
      posts
    })
  }

  async function showStaticPage(req, res, next) {
    // Get the post using slug
    let slug = [req.params.parent, req.params.page].join('/')
    slug = slug.startsWith('/') ? slug.substr(1) : slug
    // Locale of request, eg, 'en'
    const locale = req.getLocale()
    // To handle content in multiple languages, we create a page per language
    // on WordPress with a suffix in a slug, e.g., if locale is 'da' => 'page-da'
    if (locale !== 'en') {
      slug += `-${locale}`
    }
    try {
      const post = await Model.getPost(slug)
      res.render('static.html', {
        title: post.title,
        content: post.content,
        published: moment(post.date).format('MMMM Do, YYYY'),
        modified: moment(post.modified).format('MMMM Do, YYYY'),
      })
    } catch (err) {
      if (err.statusCode === 404) {
        // Pass it to next router, eg, if `/page` doesn't exist in WP, it might
        // be a org name etc.
        next()
      } else {
        next(err)
      }
    }
  }

  return router
}
