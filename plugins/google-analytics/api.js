const { google } = require('googleapis')

class GaApi {

  constructor() {
    this.jwt = new google.auth.JWT(
      process.env.GA_CLIENT_EMAIL,
      null,
      process.env.GA_PRIVATE_KEY,
      'https://www.googleapis.com/auth/analytics.readonly')
  }

  async get(params) {

    if (process.env.GA_ID.startsWith('UA')) {
      params['ids'] = 'ga:' + process.env.GA_VIEW_ID
      const analyticsdata = google.analytics({
        version: 'v3',
        auth: this.jwt
      })
      return await analyticsdata.data.ga.get(params)
    }
    else {
      params['property'] = `properties/${process.env.GA4_PROPERTY_ID}`
      const analyticsdata = google.analyticsdata({
        version: 'v1beta',
        auth: this.jwt
      });
      
      return await analyticsdata.properties.runReport(params)
    }
  }
}

module.exports.GaApi = GaApi