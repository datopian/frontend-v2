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
    query.type = "page"
    const result = await this.getListOfPostsWithMeta(query)
    return result.posts
  }

  async getListOfPosts(query) {
    const result = await this.getListOfPostsWithMeta(query)
    return result.posts
  }


  async getListOfPostsWithMeta(query) {
    return await this.blog.postsList(query)
  }

  async getCategories() {
    return await this.blog.categoriesList()
  }

  async getSiteInfo() {
    return await this.blog.get()
  }
}

module.exports.CmsModel = CmsModel
