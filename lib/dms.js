'use strict'

const { resolve, URL } = require('url')
const fetch = require('node-fetch')
const utils = require('../utils')

class DmsModel {
  constructor(opts) {
    this.config = opts.config
    this.user = opts.user
    this.api = config.get('API_URL')
    
    // add authenticated user's authorization, if present
    this.headers = (headers={}) => {
      if (this.user.apikey) {
        headers['Authorization'] = this.user.apikey
      }

      return headers
    }
  }

  async search(query, context) {
    // TODO: context can have API Key so we need to pass it through
    const action = 'package_search'
    let url = new URL(resolve(this.api, action))
    const params = utils.convertToCkanSearchQuery(query)
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: this.headers({'Content-Type': 'application/json'})
    })

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
    url.search = `id=${name}`

    let response = await fetch(url, {
      method: 'GET'
    })
    if (response.status !== 200) {
      throw response
    }
    response = await response.json()
    const datapackage = utils.ckanToDataPackage(response.result)

    datapackage.resources = await Promise.all(datapackage.resources.map(async resource => {
      return {
        views: await this.getResourceViews(resource.id), // Fetch views for the resources
        schema: resource.datastore_active && !resource.schema
          ? await this.getResourceSchema(resource.id) // Get resource schema from datastore data dictionary
          : undefined,
        ...resource
      }
    }))

    return datapackage
  }

  async getResourceSchema(resourceId) {
    try {
      const action = 'datastore_search'
      let url = new URL(resolve(this.api, action))
      let response = await fetch(url, {
        method: 'POST',
        headers: this.headers({'Content-Type': 'application/x-www-form-urlencoded'}),
        body: JSON.stringify({
          'resource_id' : resourceId,
          'limit': 0 // as we only need field info, not actual records
       })
      })

      if (response.status !== 200) {
        throw response
      }
      response = await response.json()
      const fields = response.result.fields
        .map(field => utils.dataStoreDataDictionaryToTableSchema(field))
        .filter(field => field)

      return {fields}
    } catch (e) {
      console.warn('Failed fetching datastore api when trying to fetch data dictionary', e)
      return {}
    }
  }

  async getResourceViews(resourceId) {
    try{
      const action = 'resource_view_list'
      let url = new URL(resolve(this.api, action))
      url.search = `id=${resourceId}`
    
      let response = await fetch(url, {
        method: 'GET'
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
    } catch (e) {
      console.warn('Error fetching resource views', e)
      return []
    }
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
      headers: this.headers({'Content-Type': 'application/json'})
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
    try {
      const action = 'organization_show'
      let url = new URL(resolve(this.api, action))
      url.search = `id=${owner}&include_users=false`
      let response = await fetch(url, {
        method: 'GET',
      })
      if (response.status !== 200) {
        throw response
      }
      response = await response.json()
      return response.result
    } catch (e) {
      console.warn('Failed to fetch profile', e)
      return {}
    }
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
      headers: this.headers({'Content-Type': 'application/json'})
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
      headers: this.headers({'Content-Type': 'application/json'})
    })
    if (response.status !== 200) {
      throw response
    }
    response = await response.json()
    return utils.convertToStandardCollection(response.result)
  }
}

module.exports.DmsModel = DmsModel
