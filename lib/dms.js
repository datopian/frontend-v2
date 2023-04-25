'use strict'

const { resolve, URL } = require('url')
const fetch = require('node-fetch')
const utils = require('../utils')
const querystring = require("querystring");
const logger = require('../utils/logger')

class DmsModel {
  constructor(config) {
    this.config = config
    this.api = config.get('INTERNAL_API_URL') || config.get('API_URL')
  }

  async getJsonResponse(params, action) {
    let url

    if (params !== {}) {

      let query = querystring.stringify(params)

      url = new URL(resolve(this.api, action + '?' + query))
    } else {
      url = new URL(resolve(this.api, action))
    }

    let response = await fetch(url, { 
      headers: { 'User-Agent': 'frontend-v2/latest (internal API call from frontend app)' }
    })
    
    if (response.status !== 200) {
      throw response
    }
    try {
      response = await response.json()
    }
    catch(err) {
      console.error("Error_Response", response)
      console.error("Error", err)
      response = await response.json()
    }

    return response
  }

  async search(query, context) {
    // TODO: context can have API Key so we need to pass it through
    const action = 'package_search'
    const params = utils.convertToCkanSearchQuery(query)

    const response = await this.getJsonResponse(params, action)

    // Convert CKAN descriptor => data package
    response.result.results = response.result.results.map(pkg => {
      return utils.ckanToDataPackage(pkg)
    })
    return response.result
  }

  async getPackages(context, limit = 1000, offset = 0) {
    const action = 'package_search'
    const params = {
      rows: limit,
      start: offset
    }

    const response = await this.getJsonResponse(params, action)

    return response.result.results
  }

  async getAllPackages(context) {
    const action = 'package_search'
    const params = {
      rows: 1000,
      start: 0
    }

    const response = await this.getJsonResponse(params, action)
    const packages = response.result.results
    const total = response.result.count
    const limit = 1000
    const offset = 1000
    const pages = Math.ceil(total / limit)

    let allPackages = packages

    for (let i = 1; i < pages; i++) {
      const response = await this.getJsonResponse({rows: limit, start: offset * i}, action)
      allPackages = allPackages.concat(response.result.results)
    }

    return allPackages
  }

  async getPackage(name, includeViewsAndSchema = true) {
    const action = 'package_show'
    const params = {
      id: name
    }
    const response = await this.getJsonResponse(params, action)

    const datapackage = utils.ckanToDataPackage(response.result)

    if (includeViewsAndSchema) {
      datapackage.resources = await Promise.all(datapackage.resources.map(async resource => {
        return {
          views: await this.getResourceViews(resource.id), // Fetch views for the resources
          schema: resource.datastore_active && !resource.schema
            ? await this.getResourceSchema(resource.id) // Get resource schema from datastore data dictionary
            : undefined,
          ...resource
        }
      }))
    }

    return datapackage
  }

  async getResource(packageName, resourceName) {
    const datapackage = await this.getPackage(packageName, false)
    datapackage.resources = datapackage.resources.filter(item => item.name === resourceName)

    // Redirect to 404 page if resource don't exist.
    if (datapackage.resources.length == 0) {
      var err = new Error();
      err.status = 404;
      err.statusText = 'RESOURCE NOT FOUND'
      err.text = () => {
        return 'Resource not found.'
      }
      throw (err)
    }

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
      const params = {
        'resource_id' : resourceId,
        'limit': 0 // as we only need field info, not actual records
      }
      let response = await this.getJsonResponse(params, action)

      const fields = response.result.fields
        .map(field => utils.dataStoreDataDictionaryToTableSchema(field))
        .filter(field => field)

      return {fields}
    } catch (e) {
      const details = e.text ? await e.text() : e.message
      logger.warn({
        message: `Failed to getResourceSchema | ${resourceId} | ${details}`
      })
      return {}
    }
  }

  async getResourceViews(resourceId) {
    try{
      const action = 'resource_view_list'
      const params = {
        id: resourceId
      }
      const response = await this.getJsonResponse(params, action)
      const views = response.result
      for (let i = 0; i < views.length; i++) {
        views[i] = utils.ckanViewToDataPackageView(views[i])
      }
      return views
    } catch (e) {
      const details = e.text ? await e.text() : e.message
      logger.warn({
        message: `Failed to getResourceViews | ${resourceId} | ${details}`
      })
      return []
    }
  }

  async getOrganizations(query = {}) {
    const action = 'organization_list'
    const params = Object.assign(
      {
         all_fields: true,
         sort: 'package_count'
      },
      query
    )
    const response = await this.getJsonResponse(params, action)
    // Convert CKAN group descriptor into "standard" collection descriptor
    const organizations = response.result.map(org => {
      return utils.convertToStandardCollection(org)
    })
    return organizations
  }

  async getProfile(owner) {
    try {
      const action = 'organization_show'
      const params = {
        id: owner,
        include_users: false
      }
      const response = await this.getJsonResponse(params, action)
      return response.result
    } catch (e) {
      const details = e.text ? await e.text() : e.message
      logger.warn({
        message: `Failed to getProfile | ${owner} | ${details}`
      })
      return {}
    }
  }

  async getCollections(params) {
    const action = 'group_list'
    params = params ? params : {
      all_fields: true
    }
    const response = await this.getJsonResponse(params, action)
    // Convert CKAN group descriptor into "standard" collection descriptor
    const collections = response.result.map(collection => {
      return utils.convertToStandardCollection(collection)
    })
    return collections
  }

  async getCollection(collection) {
    const action = 'group_show'
    const params = {
      id: collection
    }
    const response = await this.getJsonResponse(params, action)
    return utils.convertToStandardCollection(response.result)
  }
}

module.exports.DmsModel = DmsModel
