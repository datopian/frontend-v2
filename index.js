'use strict'

const path = require('path')
const express = require('express')
const cors = require('cors')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const i18n = require("i18n")

const config = require('./config')
const dmsRoutes = require('./routes/dms')
const cmsRoutes = require('./routes/cms')

module.exports.makeApp = function () {
  i18n.configure({
    locales: ['en'],
    cookie: 'defaultLocale',
    directory: __dirname+'/locales'
  })

  const app = express()
  app.set('config', config)
  app.set('port', config.get('app:port'))
  if (config.get('env') === 'development') {
    const mocks = require('./fixtures')
    mocks.initMocks()
  }
  const viewsDir = config.get('VIEWS') || '/views'
  app.set('views', path.join(__dirname, viewsDir))

  // Middlewares
  const assetsDir = config.get('ASSETS') || '/public'
  app.use('/static', express.static(path.join(__dirname, assetsDir)))
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(cors())
  app.use(cookieParser())
  app.use(i18n.init)
  app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
  app.use(flash())

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
    cmsRoutes(),
    dmsRoutes()
  ])

  app.use((err, req, res, next) => {
    if (err.status === 404 || err.name === 'Forbidden') {
      res.status(404).render('404.html', {
        message: 'Sorry, this page was not found',
        comment: 'You might need to Login to access more datasets'
      })
      return
    } else {
      console.error(err)
      res.status(500).send( 'Something failed. Please, try again later.')
    }
  })

  const env = nunjucks.configure(app.get('views'), {
    autoescape: true,
    express: app
  })

  return app
}

module.exports.start = function () {
  return new Promise((resolve, reject) => {
    const app = module.exports.makeApp()

    let server = app.listen(app.get('port'), () => {
      console.log('Listening on :' + app.get('port'))
      resolve(server)
    })
    app.shutdown = function () {
      server.close()
      server = null
    }
  })
}

module.exports.start()
