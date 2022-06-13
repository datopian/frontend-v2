'use strict'

const { memoize } = require('lodash')

const config = require('../../config')

const wpcom = require('wpcom')(config.get('WP_TOKEN'))
const blog = wpcom.site(config.get('WP_URL'))
const baseQuery = {
  status: `publish${eval(config.get('WP_SHOW_DRAFT')) ? ',draft' : ''}`
}
const timeout = config.get('WP_TIMEOUT') || 30000

class CmsModel {
  getPost(args) {
    const res = memoize(this.getCachedPost, (args) => JSON.stringify(args))
    return res(args)
  }

  getCachedPost({slug, id, parentSlug, parentId}={}) {
    return new Promise(async (resolve, reject) => {

      // type any will request both pages and posts
      let query = Object.assign({type: 'any'}, baseQuery)

      if (parentSlug || parentId) {
        try {
          const parentQuery = {slug: parentSlug}
          if (parentId) {
            parentQuery.id = parentId
          }
          let parent = await (await blog.post(Object.assign(parentQuery, baseQuery))).get()
          query.parent_id = parent.ID
          let posts = (await blog.postsList(query)).posts
          let post = posts.find(post => post.slug == slug)
          resolve(post)
        } catch (e) {
          reject(e)
        }

      } else {
        if (id) {
          query.id = id
        }
        query.slug = slug;
        let queryCompleted = false
        blog.post(query).get((err, data) => {
          queryCompleted = true
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
        setTimeout(() => {
          if (!queryCompleted) {
            reject(new Error('Timeout'))
          }
        }, timeout)
      }
    })
  }

  async getListOfPages(query={}) {
    query.type = "page"
    const result = await this.getCachedListOfPostsWithMeta(query)
    return result.posts
  }

  async getListOfPosts(query) {
    const result = await this.getCachedListOfPostsWithMeta(query)
    return result.posts
  }

  getCachedListOfPostsWithMeta(args) {
    const res = memoize(this.getListOfPostsWithMeta, (args) => JSON.stringify(args))
    return res(args)
  }

  async getListOfPostsWithMeta(query) {
    return await blog.postsList(Object.assign(query, baseQuery))
  }

  async getCategories() {
    return await blog.categoriesList()
  }

  async getSiteInfo() {
    return await blog.get()
  }

  api() {
    return wpcom.req
  }
}

module.exports.CmsModel = CmsModel
