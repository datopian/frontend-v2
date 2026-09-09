'use strict'

const config = require('../../config')
const TtlCache = require('../../lib/cache')

const wpcom = require('wpcom')(config.get('WP_TOKEN'))

// Shared across CmsModel instances: the plugins each construct their own model,
// and they should not each keep a private copy of the same blog content.
const cmsCache = new TtlCache()

class CmsModel {
  // `cache` is injectable so tests get isolation; at runtime every model shares
  // the module-level instance, which is the point - the plugins each build their
  // own model and should not each keep a private copy of the same blog content.
  constructor(cache = cmsCache) {
    this.cache = cache
    this.blog = wpcom.site(config.get('WP_URL'))
    this.baseQuery = {
      status: `publish${eval(config.get('WP_SHOW_DRAFT')) ? ',draft' : ''}`
    }
    this.cacheTtl = Number(config.get('CMS_CACHE_TTL')) || 0
  }

  // Every method here is a read of slow-changing blog content, and the theme
  // awaits one of them in global middleware on every non-static request, which
  // put a ~3s floor on the whole site. Caching is opt-in via CMS_CACHE_TTL so
  // portals that have not asked for it are unaffected.
  cached(method, params, load) {
    if (!(this.cacheTtl > 0)) {
      return load()
    }
    return this.cache.wrap(TtlCache.key(`wp:${method}`, params), this.cacheTtl, load)
  }

  async getPost({slug, id, parentSlug, parentId}={}) {
    return this.cached('getPost', {slug, id, parentSlug, parentId}, () =>

      new Promise(async (resolve, reject) => {

        // type any will request both pages and posts
        let query = Object.assign({type: 'any'}, this.baseQuery)

        if (parentSlug || parentId) {
          try {
            const parentQuery = {slug: parentSlug}
            if (parentId) {
              parentQuery.id = parentId
            }
            let parent = await (await this.blog.post(Object.assign(parentQuery, this.baseQuery))).get()
            query.parent_id = parent.ID
            let posts = (await this.blog.postsList(query)).posts
            let post = posts.find(post => post.slug == slug)
            resolve(post)
          } catch (e) {
            reject(e)
          }

        } else {
          if (id) {
            query.id = id
          }
          query.slug = slug
          this.blog.post(query).get((err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        }
      })
    )
  }

  async getListOfPages(query={}) {
    const result = await this.getListOfPostsWithMeta(Object.assign({}, query, {type: 'page'}))
    return result.posts
  }

  async getListOfPosts(query) {
    const result = await this.getListOfPostsWithMeta(query)
    return result.posts
  }

  async getListOfPostsWithMeta(query) {
    // Object.assign({}, ...) rather than mutating `query`: callers passing a
    // reused object would otherwise have `status` written into it, which also
    // changed its cache key between the first and second call.
    const full = Object.assign({}, query, this.baseQuery)
    return this.cached('getListOfPostsWithMeta', full, () => this.blog.postsList(full))
  }

  async getCategories() {
    return this.cached('getCategories', {}, () => this.blog.categoriesList())
  }

  async getSiteInfo() {
    return this.cached('getSiteInfo', {}, () => this.blog.get())
  }

  api() {
    return wpcom.req
  }
}

module.exports.CmsModel = CmsModel
