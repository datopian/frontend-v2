"use strict"

const config = require("../../config")
const fetch = require("node-fetch")

class CmsModel {
  constructor() {
    this.api = config.get("CKAN_PAGES_URL")
  }

  // returns promise
  async getPost(slug) {
    try {
      const url = `${this.api}ckanext_pages_show?page=${slug}`
      const res = await fetch(url)
      if (res.ok) {
        const post = await res.json()
        if (post.result) {
          return post.result
        } else {
          throw { statusCode: 404 }
        }
      } else {
        const message = await res.text()
        throw { statusCode: res.status, message }
      }
    } catch (e) {
      console.warn("Error geting ckan pages post", e)
      return {}
    }
  }

  // returns promise
  async getListOfPosts(size) {
    try {
      const url = `${this.api}ckanext_pages_list?page_type=blog`
      const res = await fetch(url)
      if (res.ok) {
        const posts = await res.json()
        return posts.result
      } else {
        const message = await res.text()
        throw { statusCode: res.status, message }
      }
    } catch (e) {
      console.warn("Error geting ckan pages posts list", e)
      return []
    }
  }

  // returns promise
  async getListOfPages() {
    try {
      const url = `${this.api}ckanext_pages_list?page_type=page`
      const res = await fetch(url)
      if (res.ok) {
        const pages = await res.json()
        return pages
      } else {
        /*istanbul ignore next*/
        const message = await res.text()
        throw { statusCode: res.status, message }
      }
    } catch (e) {
      console.warn("Error geting ckan pages pages", e)
      return {}
    }
  }
}

module.exports.CmsModel = CmsModel
