'use strict'

const express = require('express')
const moment = require('moment')

const cms = require('./cms')
const config = require('../../config')


module.exports = function (app) {
  app.set('cms', cms)
  const Model = new cms.CmsModel()
  const blogPath = config.get('WP_BLOG_PATH')

  app.get('/', async (req, res,next) => {
    // Get latest 3 blog posts and pass it to home template
    const size = 3
    let posts = await Model.getListOfPosts(size)
    posts = posts.map(post => {
      return {
        slug: post.slug,
        title: post.title,
        content: post.content,
        published: moment(post.date).format('MMMM Do, YYYY'),
        modified: moment(post.modified).format('MMMM Do, YYYY'),
        image: post.featured_image
      }
    })
    res.locals.posts = posts
    next()
  })

  app.get(blogPath, listStaticPages);
  app.get(`${blogPath}/:page`, showPostPage);
  app.get(['/:page', '/:parent/:page'], showStaticPage);

  async function listStaticPages(req, res, next) {
    // Get latest 10 blog posts
    const size = 10;
    res.locals.posts = (await Model.getListOfPosts({
      number: size,
      fields: 'slug,title,content,date,modified,featured_image'
    })).map(post => {
      return {
        slug: post.slug,
        title: post.title,
        content: post.content,
        published: moment(post.date).format('MMMM Do, YYYY'),
        modified: moment(post.modified).format('MMMM Do, YYYY'),
        image: post.featured_image
      }
    })
    next()
  }

  function getCategories(selectedCategories) {
    let categories = [
      { name: "operational-status", title: "Operational status", checked: false },
      { name: "new-datasets", title: "New datasets", checked: false },
      { name: "new-publications/declarations", title: "New publications/declarations", checked: false },
      { name: "market-data-updates", title: "Market data updates", checked: false },
      { name: "general-news-and-inspiration", title: "General news and inspiration", checked: false }
    ];

    categories = categories
      .map(category => {
        return {
          name: category.name,
          title: category.title,
          checked: selectedCategories.includes(category.name)
        }
      });

    return categories
  }

  async function showPostPage(req, res, next) {
    const slug = req.params.page
    try {
      const post = await Model.getPost(slug)
      res.render('post.html', {
        slug: post.slug,
        title: post.title,
        content: post.content,
        published: moment(post.date).format('MMMM Do, YYYY'),
        modified: moment(post.modified).format('MMMM Do, YYYY'),
        image: post.featured_image,
        thisPageFullUrl: req.protocol + '://' + req.get('host') + req.originalUrl
      })
    } catch (err) {
      next(err)
    }
  }

  async function showStaticPage(req, res, next) {
    // Get the post using slug
    let slug = [req.params.parent, req.params.page].join('/')
    slug = slug.startsWith('/') ? slug.substr(1) : slug
    // Locale of request, eg, 'en'
    const locale = req.getLocale()
    // To handle content in multiple languages, we create a page per language
    // on WordPress with a suffix in a slug, e.g., if default locale is 'en':
    // locale is 'en' > use 'page' slug when reading from WP
    // locale is 'da' => use 'page-da' slug when reading from WP
    if (locale !== config.get('SITE_LOCALE')) {
      slug += `-${locale}`
    }
    try {
      const post = await Model.getPost(slug)
      res.render('static.html', {
        slug: post.slug,
        parentSlug: req.params.parent,
        title: post.title,
        content: post.content,
        image: post.featured_image,
        thisPageFullUrl: req.protocol + '://' + req.get('host') + req.originalUrl
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
}
