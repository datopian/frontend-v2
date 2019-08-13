'use strict'

const config = require('../../config')
const fetch = require('node-fetch')

class CmsModel {
  constructor() {
    this.api = config.get('CKAN_PAGES_URL')
  }

  // returns promise
  async getPost(slug) {
   const url = `${this.api}ckanext_pages_show?page=${slug}`
   const res = await fetch(url)
   if (res.ok) {
     const post = await res.json()
     if (post.result) {
       return post.result
     } else {
       throw {statusCode: 404}
     }
   } else {
     const message = await res.text()
     throw {statusCode: res.status, message}
   }
  }

  // returns promise
  // TODO get first 10 posts as per WP implementation
  async getListOfPosts(size) {
    //const url = `${this.baseUrl}/api/3/action/ckanext_pages_list?page_type=blog`
    const url = `${this.api}ckanext_pages_list`
    const res = await fetch(url)
    if (res.ok) {
      const posts = await res.json()
      return posts.result
    } else {
      const message = await res.text()
      throw {statusCode: res.status, message}
    }
  }
}

module.exports.CmsModel = CmsModel
