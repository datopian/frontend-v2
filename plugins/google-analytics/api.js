const {google} = require('googleapis')

class GaApi {

  constructor() {
    this.jwt = new google.auth.JWT(
      process.env.GA_CLIENT_EMAIL,
      null,
      process.env.GA_PRIVATE_KEY,
      'https://www.googleapis.com/auth/analytics.readonly')
  }

  async get(params) {

    const defaultParams = {
      'auth': this.jwt,
      'ids': 'ga:' + process.env.GA_VIEW_ID,
    }

    const endParams = {...defaultParams, ...params}

    return await google.analytics('v3').data.ga.get(endParams)
  }
}

module.exports.GaApi = GaApi