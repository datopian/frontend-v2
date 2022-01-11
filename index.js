const path = require('path')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const i18n = require("i18n")
const moment = require('moment')
const redis = require('redis')
const fetch = require('node-fetch')
const { URL, resolve } = require('url')
const morgan = require('morgan');

const config = require('./config')
const dmsRoutes = require('./routes/dms')
const authRoutes = require('./routes/auth')
const {loadTheme, loadPlugins, processMarkdown} = require('./utils')
const logger = require('./utils/logger')
const RedisStore = require('connect-redis')(session)

module.exports.makeApp = function () {
  const app = express()
  app.set('config', config)
  app.set('dms', require('./lib/dms'))
  app.set('utils', require('./utils/index'))
  app.set('logger', logger)
  app.set('port', config.get('app:port'))
  if (config.get('env') === 'development') {
    const mocks = require('./fixtures')
    mocks.initMocks()
    logger.warn('You are activated the mocks.')
  }
  // Explicitely set views location - this is needed for Zeit to work
  app.set('views', path.join(__dirname, '/views'))

  // i18n
  const translationsDir = config.get('TRANSLATIONS') || '/i18n'
  i18n.configure({
    cookie: 'defaultLocale',
    directory: __dirname + translationsDir,
    defaultLocale: config.get('DEFAULT_LOCALE') || 'en'
  })

  // Middlewares
  // Theme comes first so it overrides
  const themeDir = config.get('THEME_DIR')
  const themeName = config.get('THEME')
  if (themeName) {
    app.use('/static', express.static(path.join(__dirname, `/${themeDir}/${themeName}/public`)))
  }
  // Default assets
  app.use('/static', express.static(path.join(__dirname, '/public')))

  const authEnabled = config.get('kratos') && config.get('kratos').admin && config.get('kratos').public

  // Auth (kratos) isn't compatiable with body-parser
  if (!authEnabled) {
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    )
  }

  app.use(cors())
  app.use(cookieParser())
  app.use(i18n.init)

  // Default session options
  let sessionOptions = {
    secret: config.get('SESSION_SECRET'),
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: config.get("SESSION_COOKIE_MAX_AGE")
        ? parseInt(config.get("SESSION_COOKIE_MAX_AGE"))
        : 60 * 60 * 1000
    }
  }

  if (config.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
  }

  // Redis session store for production
  if (config.get('REDIS_URL')) {
    const redisClient = redis.createClient({
      url: config.get('REDIS_URL')
    })
    
    redisClient.on('error', err => {
      logger.error(err);
    });

    sessionOptions.resave = false
    sessionOptions.store = new RedisStore({ client: redisClient })
  }

  app.use(session({ ...sessionOptions }))
  // Handling session error
  app.use(function (req, res, next) {
    if (!req.session) {
      var err = new Error();
      err.status = 500;
      err.statusText = 'Something has failed. Please, try again later.'
      err.text = () => {
        return 'Failed to configure session.'
      }
      next(err)
    }
    next() 
  })


  // Configure Moment locale
  app.use(function (req, res, next) {
    moment.locale(i18n.getLocale(req))

    next()
  });

  // enable flash messages
  app.use(flash())

  /*
    Route to check the status of the application by
    calling the package_search of backend with row count as 0
    to check whether the application is returning response or not
  */
  app.get('/status', async (req, res) => {
    const url = resolve(
      config.get('API_URL'),
      `package_search?rows=0`
    )
    const response = await fetch(url, {
      headers: { 'User-Agent': 'frontend-v2/latest (internal API call from frontend app)' }
    })
    if (response.ok) {
      const body = await response.json()
      if (body.success == true) {
        res.status(200).send('Ok')
      } else {
        res.status(500).send('Not Ok')
      }

    }
  })

  // Auth
  if (authEnabled) {
    authRoutes(app)
  }

// Get real IP address from server
  morgan.token("remote-addr", function (req) {
    return (
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) || undefined);
  });

  app.use(morgan('combined'))

  app.use((req, res, next) => {
    res.locals.message = req.flash('info')
    next()
  })

  loadPlugins(app)
  loadTheme(app)

  // Redirect x/y/ to x/y
  app.use((req, res, next) => {
    if(req.url.substr(-1) === '/' && req.url.length > 1) {
      res.redirect(301, req.url.slice(0, req.url.length-1))
    }
    else {
      next()
    }
  })

  // Controllers
  app.use([
    dmsRoutes()
  ])

 // Redirect to 404 page for other invalid URL request.
  app.get('*', function (req, res, next) {
    let err = new Error()
    err.status = 404
    err.statusText = 'PAGE NOT FOUND'
    err.text = () => {
      return 'PAGE NOT FOUND'
    }
    next(err)
  })

  app.use(async (err, req, res, next) => {
    if (err.status >= 400 && err.status < 500) {
      logger.warn(`${err.statusText} ${err.status} | ${await err.text()}`)
      res.status(err.status).render('404.html', {
        message: err.statusText,
        status: err.status
      })
      return
    } else if (err.status >= 500) {
      logger.error(`${err.statusText} ${err.status} | ${await err.text()}`)
      res.status(500).send('Something failed. Please, try again later.')
    } else {
      logger.error(err)
      res.status(500).send('Something failed. Please, try again later.')
    }
  })

  // look for views template folder and in plugins folders
  const views = [path.join(__dirname, `/plugins`), app.get('views')]

  // also look for view templates in enabled theme directory
  if (themeName) {
    views.unshift(path.join(__dirname, `/${themeDir}/${themeName}/views`))
  }

  const env = nunjucks.configure(views, {
    autoescape: true,
    express: app
  })

  env.addFilter('formatDate', (date) => {
    try {
      return moment(date).format('YYYY[-]MM[-]DD')
    } catch (e) {
      logger.warn('Failed to format date', e)
      return date || '--'
    }
  })
  
  env.addFilter('formatDateFromNow', (date) => {
    try {
      return moment.utc(date).fromNow()
    } catch (e) {
      logger.warn('Failed to format date', e)
      return date || '--'
    }
  })

  env.addFilter('processMarkdown', (str) => {
    try {
      return processMarkdown.render(String(str))
    } catch (e) {
      logger.warn('Failed to format markdown', e)
      return str
    }
  })

  env.addFilter('split', (str, regExp) => {
    try {
      return str.match(regExp)
    } catch (e) {
      logger.warn('Failed to split string by regular expression', e)
      return str
    }
  })

  env.addFilter('find', (resources, name) => {
    try {
      return resources.find(resource => resource.name === name)
    } catch (e) {
      logger.warn('Failed to find resource', e)
      return str
    }
  })

  return app
}

module.exports.start = function () {
  return new Promise((resolve, reject) => {
    const app = module.exports.makeApp()

    let server = app.listen(app.get('port'), () => {
      logger.info('Listening on :' + app.get('port'))
      resolve(server)
    })
    app.shutdown = function () {
      server.close()
      server = null
    }
  })
}

if (process.env.NODE_ENV !== 'test') {
  module.exports.start()
}
