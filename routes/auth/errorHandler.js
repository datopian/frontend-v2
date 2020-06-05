const config = require('../../config')
const { CommonApi, ErrorContainer } = require('@oryd/kratos-client')
const { IncomingMessage } = require('http')

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
        res.status(500).send({
          message: JSON.stringify(errorContainer.errors, null, 2),
        })
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
