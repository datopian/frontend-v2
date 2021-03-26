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
  // app.get('/auth/registration', registrationHandler)
  app.get('/auth/login', (req, res, next) => {
      const flow = req.query.flow;
      // The flow is used to identify the login and registration flow and
      // return data like the csrf_token and so on.
      if (!flow) {
          console.log('No flow ID found in URL, initializing login flow.');
          res.redirect(`/.ory/kratos/public/self-service/login/browser`);
          return;
      }
      return kratos.getSelfServiceLoginFlow(flow)
          .then(({status, data: flow}) => {
          if (status !== 200) {
              return Promise.reject(flow);
          }
          flow.methods.oidc.config.action = new URL(flow.methods.oidc.config.action).pathname

          res.locals.sso = flow.methods.oidc.config
          res.locals.password = flow.methods.password.config
          res.locals.accountExists = res.locals.sso.fields.find(item => item.name === 'traits.email')
          next()
      })
          // Handle errors using ExpressJS' next functionality:
          .catch(err => {
            logger.error(err)
            next(err)
          })
  })
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
