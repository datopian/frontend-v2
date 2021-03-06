const config = require('../../config')
const logger = require('../../utils/logger')


const { Configuration, PublicApi } = require('@ory/kratos-client')



// A simple express handler that shows the login / registration screen.
// Argument "type" can either be "login" or "registration" and will
// fetch the form data from ORY Kratos's Public API.
const kratos = new PublicApi(new Configuration({ basePath: config.get('kratos').public}) )

module.exports.authHandler = (type) => (
  req,
  res,
  next
) => {
  const flow = req.query.flow

  // The request is used to identify the login and registration request and
  // return data like the csrf_token and so on.
  if (!flow) {
    logger.warn('No flow ID found in URL, initializing login flow.')
    res.redirect(`${config.get('KRATOS_PUBLIC_URL')}/self-service/${type}/browser`)
    return
  }

  const authRequest =
    type === 'login'
      ? kratos.getSelfServiceLoginFlow(flow)
      : kratos.getSelfServiceRegistrationFlow(flow)

  authRequest
    .then(({ status, data : flow}) => {
      if (status == 404 || status == 410 || status == 403) {
        res.redirect(
          `${config.get('KRATOS_PUBLIC_URL')}/self-service/${type}/browser}`
        )
        return
      } else if (status != 200) {
        return Promise.reject(flow)
      }
      return flow
    })
    .then((flow) => {
      if (!flow) {
        res.redirect(`${config.get('KRATOS_PUBLIC_URL')}/self-service/${type}/browser`)
        return
      }
      res.locals.sso = flow.methods.oidc.config
      res.locals.password = flow.methods.password.config
      res.locals.accountExists = res.locals.sso.fields.find(item => item.name === 'traits.email')
      next()
    })
    .catch(err => {
      logger.error(err)
      next(err)
    })
}
