'use strict'

const logger = require('../utils/logger')

// In-process TTL cache for slow, read-only CKAN actions.
//
// Exists because organization_list/group_list with all_fields=true are an N+1 in
// CKAN: it calls organization_show once per org, each running its own Solr query
// for the dataset count. On oddk-prod that is 51 sequential queries and ~9.3s,
// paid on every render of the home page and /organization. See
// datopian/tech-devops#668 for the upstream fix that would make this unnecessary.
//
// Deliberately in-process, not Redis: the cache is per-pod and cold after a
// restart, which is accepted - the point is that the Nth visitor does not pay
// what the 1st does. Entries store the in-flight promise, so concurrent misses
// share one upstream call instead of each starting its own.

const MAX_ENTRIES = 200

class TtlCache {
  constructor() {
    this.entries = new Map()
  }

  // Stable across param ordering, so equivalent calls share an entry.
  static key(action, params) {
    const parts = Object.keys(params || {})
      .sort()
      .map(name => `${name}=${params[name]}`)
    return `${action}?${parts.join('&')}`
  }

  // `load` is only invoked on a miss. Its promise is what gets cached, so
  // callers arriving mid-flight await the same upstream request.
  async wrap(key, ttlSeconds, load) {
    const now = Date.now()
    const cached = this.entries.get(key)

    if (cached && cached.expires > now) {
      return cached.promise
    }

    const promise = load().catch(err => {
      this.entries.delete(key)
      // A refresh failure should not blank a page that has rendered before.
      if (cached && 'value' in cached) {
        logger.warn({
          message: `cache: refresh failed for ${key}, serving stale copy`
        })
        return cached.value
      }
      throw err
    })

    if (this.entries.size >= MAX_ENTRIES && !this.entries.has(key)) {
      this.entries.delete(this.entries.keys().next().value)
    }

    const entry = { expires: now + ttlSeconds * 1000, promise }
    if (cached && 'value' in cached) {
      entry.value = cached.value
    }
    this.entries.set(key, entry)

    // Retain the resolved value so the stale fallback above has something to
    // serve. Guarded so a superseded promise cannot overwrite a newer entry.
    promise
      .then(value => {
        const current = this.entries.get(key)
        if (current && current.promise === promise) {
          current.value = value
        }
      })
      .catch(() => {})

    return promise
  }
}

module.exports = TtlCache
