'use strict'

const { resolve, URL } = require('url')
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
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status !== 200) {
      throw response
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
    let url = new URL(resolve(this.api, action))
    const params = {
      name_or_id: name
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status !== 200) {
      throw response
    }
    response = await response.json()
    const datapackage = utils.ckanToDataPackage(response.result)
    return datapackage
  }

  async getResourceViews(resourceId) {
    const action = 'resource_view_list'
    let url = new URL(resolve(this.api, action))
    const params = {
      id: resourceId
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status !== 200) {
      throw response
    }
    response = await response.json()
    const views = response.result
    for (let i = 0; i < views.length; i++) {
      views[i] = utils.ckanViewToDataPackageView(views[i])
    }
    return views
  }

  async getOrganizations() {
    const action = 'organization_list'
    let url = new URL(resolve(this.api, action))
    const params = {
      all_fields: true,
      sort: 'package_count'
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status !== 200) {
      throw response
    }
    response = await response.json()
    // Convert CKAN group descriptor into "standard" collection descriptor
    const organizations = response.result.map(org => {
      return utils.convertToStandardCollection(org)
    })
    return organizations
  }

  async getProfile(owner) {
    const action = 'organization_show'
    let url = new URL(resolve(this.api, action))
    const params = {
      id: owner,
      include_users: false
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status !== 200) {
      throw response
    }
    response = await response.json()
    return response.result
  }

  async getCollections(params) {
    const action = 'group_list'
    let url = new URL(resolve(this.api, action))
    params = params ? params : {
      all_fields: true
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status !== 200) {
      throw response
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
    let url = new URL(resolve(this.api, action))
    const params = {
      id: collection
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status !== 200) {
      throw response
    }
    response = await response.json()
    return utils.convertToStandardCollection(response.result)
  }
}

module.exports.DmsModel = DmsModel
