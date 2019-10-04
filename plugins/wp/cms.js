'use strict'

const config = require('../../config')

const wpcom = require('wpcom')(config.get('WP_TOKEN'))


class CmsModel {
  constructor() {
    this.blog = wpcom.site(config.get('WP_URL'))
  }


  getPost(slug) {
    return new Promise((resolve, reject) => {
      this.blog.post({slug: slug}).getBySlug((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
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
}

module.exports.CmsModel = CmsModel
