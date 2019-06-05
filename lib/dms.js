'use strict'

const urllib = require('url')
const fetch = require('node-fetch')
const utils = require('../utils')

class DmsModel {
  constructor(config) {
    this.config = config
    this.api = config.get('API_URL')
  }

  async search(query) {
    const action = 'package_search'
    let url = urllib.resolve(this.api, action)
    url += query ? `?${query}` : ''
    console.log(url)
    let response = await fetch(url)
    if (response.status !== 200) {
      throw {
        name: 'BadStatusCode',
        message: `Bad response from API for ${query}`,
        response
      }
    }
    response = await response.json()
    // Convert CKAN descriptor => data package
    response.result.results = response.result.results.map(pkg => {
      return utils.ckanToDataPackage(pkg)
    })
    return response.result
  }

  async getPackage(name) {
    const action = 'package_show'
    let url = urllib.resolve(this.api, action)
    url += `?name_or_id=${name}`
    let response = await fetch(url)
    if (response.status !== 200) {
      throw {
        name: 'BadStatusCode',
        message: `Bad response from API for ${name}`,
        response
      }
    }
    response = await response.json()
    return utils.ckanToDataPackage(response.result)
  }
}

module.exports.DmsModel = DmsModel
