const request = require('request')
const {  Configuration, PublicApi } = require('@oryd/kratos-client')
const config = require('../../config')
const { authHandler } = require('./authHandler')
const { dashboard } = require('./dashboard')
const { errorHandler } = require('./errorHandler')
const logger = require('../../utils/logger')
const proxy = require('express-http-proxy')

const kratos = new PublicApi(new Configuration({basePath: config.get('kratos').public}))

const protect = (req, res, next) => {
  // When using ORY Oathkeeper, the redirection is done by ORY Oathkeeper.
  // Since we're checking for the session ourselves here, we redirect here
  // if the session is invalid.
  kratos.whoami(
    req.header('Cookie'),
    req.header('Authorization'),
  ).then(({ data: session }) => {
    // `whoami` returns the session or an error. We're changing the type here
    // because express-session is not detected by TypeScript automatically.
    req.user = { session }
    next()
  }).catch(() => {
    // If no session is found, redirect to login.
    res.redirect('/auth/login')
  })
}

module.exports = function(app) {
  app.use((req, res, next) => {
    if (req.cookies.ory_kratos_session) {
      kratos
        .whoami(
          req.header('Cookie'),
          req.header('Authorization'),
        )
        .then(({ status, data: flow }) => {
          res.locals.logged_in = true;
          res.locals.userEmail = flow.identity.traits.email;
          res.locals.userId = flow.identity.id;
          res.locals.userName = flow.identity.traits.name;
          next()
        })
        .catch(() => {
          next()
        })
    } else {
      next()
    }
  })

  app.use('/.ory/kratos/public/', (req, res, next) => {
    const url =
      config.get('kratos').public + req.url.replace('/.ory/kratos/public', '')
    req
      .pipe(
        request(url, { followRedirect: false })
          .on('error', err => next)
      )
      .pipe(res)
  })

  app.get('/dashboard', protect, dashboard)
  app.get('/auth/registration', authHandler('registration'))
  app.get('/auth/login', authHandler('login'))
  app.get('/auth/logout', (req, res) => {
    res.redirect('/.ory/kratos/public/self-service/browser/flows/logout')
  })
  app.post('/auth/delete', protect, (req, res, next) => {
    adminEndpoint.deleteIdentity(res.locals.userId)
      .then(response => {
        res.redirect('/auth/registration')
      })
      .catch(err => {
        logger.error(err)
        next(err)
      })
  })
  app.get('/error', errorHandler)
  app.get('/settings', protect)
}
