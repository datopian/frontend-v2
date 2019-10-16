const moment = require('moment')

module.exports = function (app) {
  const utils = app.get('utils')
  const dms = app.get('dms')
  const cms = app.get('cms')
  const config = app.get('config')
  const DmsModel = new dms.DmsModel(config)
  const CmsModel = new cms.CmsModel()

  app.use((req, res, next) => {
    req.setLocale('da')
    next()
  })

  app.use(async (req, res, next) => {
    // Get links for the navbar from CMS (WP)
    res.locals.aboutPages = (await CmsModel.getListOfPosts({type: 'page'}))
      .filter(page => page.parent && page.parent.ID === 11)
    next()
  })

  // Need to do this again for routes in WP CMS plugin as it never hits `.use` middleware
  // TODO: fix WP CMS plugin so it doesn't send back the response before theme
  // controller is executed.
  app.param('page', async (req, res, next) => {
    if (!res.locals.aboutPages) {
      res.locals.aboutPages = (await CmsModel.getListOfPosts({type: 'page'}))
        .filter(page => page.parent && page.parent.ID === 11)
    }
    // Add featured posts
    res.locals.featuredPosts = (await CmsModel.getListOfPosts(
      {
        tag: 'featured',
        number: 5
      }
    )).map(post => {
      return {
        slug: post.slug,
        title: post.title,
        content: post.content,
        published: moment(post.date).format('Do MMMM YYYY'),
        modified: moment(post.modified).format('Do MMMM YYYY'),
        image: post.featured_image
      }
    })
    next()
  })

  app.get('/', async (req, res, next) => {
    // Set up main heading text from config var:
    res.locals.home_heading = config.get('HOME_HEADING') || ''
    // Get collections with extras
    const collections = await DmsModel.getCollections({
      all_fields: true,
      include_extras: true,
      include_dataset_count: false
    })
    // Filter collections as we want to show only featured items
    const featured = collections.filter(collection => {
      return collection.extras.find(extra => extra.key === 'featured' && extra.value)
    })
    // Shuffle array
    let shuffled
    if (featured.length >= 4) {
      shuffled = featured.sort(() => 0.5 - Math.random())
    } else {
      shuffled = collections.sort(() => 0.5 - Math.random())
    }
    // Get sub-array of first n elements after shuffled
    const randomFour = shuffled.slice(0, 4)
    res.locals.collections = randomFour

    // Get events
    res.locals.events = (await CmsModel.getListOfPosts(
      {
        category: 'Events',
        number: 5
      }
    )).map(post => {
      let eventDate
      for (let key in post.tags) {
        if (key.startsWith('dato:')) {
          eventDate = post.tags[key].name.match(/\d{2}([\/.-])\d{2}\1\d{4}/g)
        }
      }
      const monthNames = ["jan", "feb", "mar", "apr", "maj", "jun", "jul",
        "aug", "sep", "okt", "nov", "dec"
      ]
      if (eventDate) {
        const day = eventDate[0].substring(0, 2)
        const month = eventDate[0].substring(3, 5)
        const year = eventDate[0].substring(6, 10)
        const date = new Date(`${year}-${month}-${day}`)
        post.day = date.getDate()
        post.month = monthNames[date.getMonth()]
        // Check if event is completed:
        post.completed = date < new Date() ? true : false
      } else {
        // If no 'dato' tag is found, use current date:
        const now = new Date()
        post.day = now.getUTCDate()
        post.month = monthNames[now.getUTCMonth()]
      }
      return post
    })

    // Get title and content of about page to display it on front page:
    const aboutPage = await CmsModel.getPost('about')
    res.locals.aboutTitle = aboutPage.title
    res.locals.aboutText = aboutPage.content
    next()
  })

  app.get('/blog', async (req, res, next) => {
    // Get list of categories
    const {found, categories} = await CmsModel.getCategories()
    res.locals.categories = categories
    res.locals.selectedCategory = req.query.category

    // Add featured posts
    res.locals.featuredPosts = (await CmsModel.getListOfPosts(
      {
        tag: 'featured',
        number: 5
      }
    )).map(post => {
      return {
        slug: post.slug,
        title: post.title,
        content: post.content,
        published: moment(post.date).format('Do MMMM YYYY'),
        modified: moment(post.modified).format('Do MMMM YYYY'),
        image: post.featured_image
      }
    })
    next()
  })

  app.get('/search', async (req, res, next) => {
    try {
      let facetNameToShowAll
      for (let [key, value] of Object.entries(req.query)) {
        if (key.includes('facet.limit.')) {
          facetNameToShowAll = key.split('.')[2]
          req.query['facet.limit'] = value
        }
      }
      const result = await DmsModel.search(req.query)
      if (facetNameToShowAll) {
        for (let [key, value] of Object.entries(result.search_facets)) {
          // Sort facets by count
          result.search_facets[key].items = result.search_facets[key].items
            .sort((a, b) => b.count - a.count)
          if (key !== facetNameToShowAll) {
            result.search_facets[key].items = result.search_facets[key].items
              .slice(0, 5)
          }
        }
      }
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
    } catch (e) {
      next(e)
    }
  })

  app.get('/search/content', async (req, res, next) => {
    try {
      const result = await CmsModel.getListOfPostsWithMeta(
        {
          type: 'any',
          search: req.query.q,
          number: 10,
          offset: req.query.from || 0
        }
      )
      // Pagination
      const from = req.query.from || 0
      const size = 10
      const total = result.found
      const totalPages = Math.ceil(total / size)
      const currentPage = parseInt(from, 10) / size + 1
      const pages = utils.pagination(currentPage, totalPages)

      res.render('search.html', {
        title: 'Search content',
        result,
        query: req.query,
        totalPages,
        pages,
        currentPage
      })
    } catch (e) {
      next(e)
    }
  })
}
