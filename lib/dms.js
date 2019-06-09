'use strict'

const { resolve, URL, URLSearchParams } = require('url')
const fetch = require('node-fetch')
const utils = require('../utils')

class DmsModel {
  constructor(config) {
    this.config = config
    this.api = config.get('API_URL')
  }

  async search(query, context) {
    // TODO: context can have API Key so we need to pass it through
    const action = 'package_search'
    let url = new URL(resolve(this.api, action))
    const params = utils.convertToCkanSearchQuery(query)
    url.search = new URLSearchParams(params)
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
    let url = resolve(this.api, action)
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

  async getProfile(owner) {
    const action = 'organization_show'
    let url = resolve(this.api, action)
    url += `?id=${owner}&include_users=false`
    let response = await fetch(url)
    if (response.status !== 200) {
      throw {
        name: 'BadStatusCode',
        message: `Bad response from API for ${owner}`,
        response
      }
    }
    response = await response.json()
    return response.result
  }

  async getCollections() {
    const action = 'group_list'
    let url = resolve(this.api, action)
    url += '?all_fields=true'
    let response = await fetch(url)
    if (response.status !== 200) {
      throw {
        name: 'BadStatusCode',
        message: `Bad response from API for group_list`,
        response
      }
    }
    response = await response.json()
    // Convert CKAN group descriptor into "standard" collection descriptor
    const collections = response.result.map(collection => {
      return utils.convertToStandardCollection(collection)
    })
    return collections
  }

  async getCollection(collection) {
    const action = 'group_show'
    let url = resolve(this.api, action)
    url += `?id=${collection}`
    let response = await fetch(url)
    if (response.status !== 200) {
      throw {
        name: 'BadStatusCode',
        message: `Bad response from API for ${collection}`,
        response
      }
    }
    response = await response.json()
    return utils.convertToStandardCollection(response.result)
  }
}

module.exports.DmsModel = DmsModel
