'use strict'

const config = require('../config')

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


  async getListOfPosts(size) {
    // Return latest 10 blog posts by default
    size = size || 10
    const result = await this.blog.postsList({number: size})
    return result.posts
  }
}

module.exports.CmsModel = CmsModel
