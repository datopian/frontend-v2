const config = require('../../config')
const logger = require('../../utils/logger')

const {
  AdminApi,
  FormField,
  LoginRequest,
  RegistrationRequest,
} = require('@oryd/kratos-client')
const {IncomingMessage} = require('http')

// A simple express handler that shows the login / registration screen.
// Argument "type" can either be "login" or "registration" and will
// fetch the form data from ORY Kratos's Public API.
const adminEndpoint = new AdminApi(config.get('kratos').admin)

module.exports.authHandler = (type) => (
  req,
  res,
  next
) => {
  const request = req.query.request

  // The request is used to identify the login and registration request and
  // return data like the csrf_token and so on.
  if (!request) {
    logger.warn('No request found in URL, initializing auth flow.')
    res.redirect(`${config.get('SITE_URL')}/.ory/kratos/public/self-service/browser/flows/${type}`)
    return
  }

  const authRequest =
    type === 'login'
      ? adminEndpoint.getSelfServiceBrowserLoginRequest(request)
      : adminEndpoint.getSelfServiceBrowserRegistrationRequest(request)

  authRequest
    .then(({body, response}) => {
      if (response.statusCode == 404 || response.statusCode == 410 || response.statusCode == 403) {
        res.redirect(
          `${config.get('SITE_URL')}/.ory/kratos/public/self-service/browser/flows/${type}`
        )
        return
      } else if (response.statusCode != 200) {
        return Promise.reject(body)
      }

      return body
    })
    .then((request) => {
      if (!request) {
        res.redirect(`${config.get('SITE_URL')}/.ory/kratos/public/self-service/browser/flows/${type}`)
        return
      }
      res.locals.sso = request.methods.oidc.config
      res.locals.password = request.methods.password.config
      res.locals.accountExists = res.locals.sso.fields.find(item => item.name === 'traits.email')
      next()
    })
    .catch(err => {
      logger.error(err)
      next(err)
    })
}
