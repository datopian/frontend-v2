'use strict'

const config = require('../../config')

const wpcom = require('wpcom')(config.get('WP_TOKEN'))


class CmsModel {
  constructor() {
    this.blog = wpcom.site(config.get('WP_URL'))
  }


  async getPost(slug, parentSlug = "") {

    return new Promise(async (resolve, reject) => {

      // type any will request both pages and posts
      let query = {type: 'any'}

      if (parentSlug) {
        try {
          let parent = await (await this.blog.post({slug: parentSlug})).getBySlug()
          query.parent_id = parent.ID
          let posts = (await this.blog.postsList(query)).posts
          let post = posts.find(post => post.slug == slug)
          resolve(post)
        } catch (e) {
          reject(e)
        }

      } else {
        query.slug = slug
        this.blog.post(query).getBySlug((err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      }
    })
  }

  async getListOfPages(query={}) {
    try {
      query.type = "page"
      const result = await this.getListOfPostsWithMeta(query)
      return result.posts
    } catch (e) {
      console.warn('Failed to fetch wordpress pages', e)
      return []
    }
  }

  async getListOfPosts(query) {
    try {
      const result = await this.getListOfPostsWithMeta(query)
      return result.posts
    } catch (e) {
      console.warn('Failed to fetch wordpress posts', e)
      return []
    }
  }


  async getListOfPostsWithMeta(query) {
    try {
      return await this.blog.postsList(query)
    } catch (e) {
      console.warn('Failed to fetch wordpress list of posts with meta', e)
      return []
    }
  }

  async getCategories() {
    try {
      return await this.blog.categoriesList()
    } catch (e) {
      console.warn('Failed to fetch wordpress category list', e)
      return []
    }
  }

  async getSiteInfo() {
    try {
      return await this.blog.get()
    } catch (e) {
      console.warn('Failed to fetch wordpress site info', e)
      return
    }
  }

  api() {
    return wpcom.req
  }
}

module.exports.CmsModel = CmsModel
