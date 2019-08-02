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
   const post = await res.json()
   console.log("POST!", post)
   return post.result
  }

  // returns promise
  // TODO get first 10 posts as per WP implementation
  async getListOfPosts(size) {
    //const url = `${this.baseUrl}/api/3/action/ckanext_pages_list?page_type=blog`
    const url = `${this.api}ckanext_pages_list`
    const res = await fetch(url)
    const posts = await res.json()
    console.log('RES', posts)
    return posts.result
  }
}

module.exports.CmsModel = CmsModel
