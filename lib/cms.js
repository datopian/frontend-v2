'use strict'

const wpcom = require('wpcom')()

const config = require('../config')


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


  async getListOfPosts() {
    // Return latest 10 blog posts
    const result = await this.blog.postsList({number: 10})
    return result.posts
  }
}

module.exports.CmsModel = CmsModel
