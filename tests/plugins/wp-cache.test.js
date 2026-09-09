const test = require('ava')
const wp = require('../../plugins/wp/cms')
const TtlCache = require('../../lib/cache')

// Build a model with a stubbed blog, so these tests exercise the caching layer
// rather than wpcom or the network.
function model(ttl) {
  const m = new wp.CmsModel(new TtlCache())
  m.cacheTtl = ttl
  const calls = { postsList: 0, get: 0, categoriesList: 0 }
  m.blog = {
    postsList: async q => { calls.postsList += 1; return { posts: [{ slug: 'a', q }] } },
    get: async () => { calls.get += 1; return { description: 'site' } },
    categoriesList: async () => { calls.categoriesList += 1; return ['cat'] }
  }
  return { m, calls }
}

test('getListOfPosts is cached - the per-request middleware call', async t => {
  const { m, calls } = model(60)
  await m.getListOfPosts({ type: 'page' })
  await m.getListOfPosts({ type: 'page' })
  await m.getListOfPosts({ type: 'page' })
  t.is(calls.postsList, 1, 'three identical reads must hit WordPress once')
})

test('different queries are cached separately', async t => {
  const { m, calls } = model(60)
  await m.getListOfPosts({ type: 'page' })
  await m.getListOfPosts({ tag: 'featured', number: 5 })
  t.is(calls.postsList, 2)
})

test('getSiteInfo and getCategories are cached', async t => {
  const { m, calls } = model(60)
  await m.getSiteInfo(); await m.getSiteInfo()
  await m.getCategories(); await m.getCategories()
  t.is(calls.get, 1)
  t.is(calls.categoriesList, 1)
})

test('caching is off when CMS_CACHE_TTL is 0', async t => {
  const { m, calls } = model(0)
  await m.getListOfPosts({ type: 'page' })
  await m.getListOfPosts({ type: 'page' })
  t.is(calls.postsList, 2, 'must be a no-op for portals that have not opted in')
})

test('concurrent identical reads collapse into one upstream call', async t => {
  const m = new wp.CmsModel(new TtlCache())
  m.cacheTtl = 60
  let calls = 0
  m.blog = {
    postsList: async () => {
      calls += 1
      await new Promise(r => setTimeout(r, 20))
      return { posts: [] }
    }
  }
  await Promise.all([
    m.getListOfPosts({ type: 'page' }),
    m.getListOfPosts({ type: 'page' }),
    m.getListOfPosts({ type: 'page' })
  ])
  t.is(calls, 1, 'a cold cache under concurrency must not fan out')
})

test('a failed refresh serves the last good value', async t => {
  const m = new wp.CmsModel(new TtlCache())
  // A short positive TTL, then wait it out: `cached()` only engages the cache
  // when cacheTtl > 0, so a negative sentinel would bypass caching entirely.
  m.cacheTtl = 0.05
  let calls = 0
  m.blog = {
    postsList: async () => {
      calls += 1
      if (calls === 1) return { posts: [{ slug: 'good' }] }
      throw new Error('WordPress is down')
    }
  }
  const first = await m.getListOfPosts({ type: 'page' })
  t.is(first[0].slug, 'good')
  await new Promise(r => setTimeout(r, 80)) // let the entry go stale
  const second = await m.getListOfPosts({ type: 'page' })
  t.is(second[0].slug, 'good', 'a WP outage must not blank the navbar')
})

test('getListOfPostsWithMeta does not mutate the query it is given', async t => {
  const { m } = model(0)
  const query = { type: 'page' }
  await m.getListOfPostsWithMeta(query)
  t.deepEqual(query, { type: 'page' }, 'status must not leak into the caller object')
})

test('getListOfPages does not mutate the query it is given', async t => {
  const { m } = model(0)
  const query = {}
  await m.getListOfPages(query)
  t.deepEqual(query, {}, 'type must not leak into the caller object')
})
