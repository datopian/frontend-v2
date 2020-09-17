const config = require('../../config')
const { CommonApi, ErrorContainer } = require('@oryd/kratos-client')
const { IncomingMessage } = require('http')
const logger  = require('../../utils/logger')
const commonApi = new CommonApi(config.get('kratos').admin)

module.exports.errorHandler = (req, res, next) => {
  const error = req.query.error

  if (!error) {
    // No error was send, redirecting back to home.
    res.redirect(config.get('SITE_URL'))
    return
  }

  commonApi
    .getSelfServiceError(error)
    .then(
      ({
        body,
        response,
      }) => {
        if (response.statusCode == 404) {
          // The error could not be found, redirect back to home.
          res.redirect(config.get('SITE_URL'))
          return
        }

        return body
      }
    )
    .then((errorContainer = {}) => {
      if ('errors' in errorContainer) {
        const errorMessage = JSON.stringify(errorContainer.errors, null, 2)
        logger.warn(errorMessage)
        req.flash(
          'info',
          'We could not login/register you this time. Please, try again later. If the issue persists, please contact the site administration.'
        )
        res.redirect('/auth/registration')
        return Promise.resolve()
      }

      return Promise.reject(
        `expected errorContainer to contain "errors" but got ${JSON.stringify(
          errorContainer
        )}`
      )
    })
    .catch(err => next(err))
}
