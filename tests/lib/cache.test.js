const test = require('ava')
const TtlCache = require('../../lib/cache')

test('key is stable regardless of param ordering', t => {
  t.is(
    TtlCache.key('organization_list', { all_fields: true, sort: 'name' }),
    TtlCache.key('organization_list', { sort: 'name', all_fields: true })
  )
})

test('key separates different actions and params', t => {
  t.not(
    TtlCache.key('organization_list', { all_fields: true }),
    TtlCache.key('group_list', { all_fields: true })
  )
  t.not(
    TtlCache.key('organization_list', { all_fields: true }),
    TtlCache.key('organization_list', { all_fields: false })
  )
})

test('a hit within the TTL does not call the loader again', async t => {
  const cache = new TtlCache()
  let calls = 0
  const load = async () => {
    calls += 1
    return calls
  }

  t.is(await cache.wrap('k', 60, load), 1)
  t.is(await cache.wrap('k', 60, load), 1)
  t.is(calls, 1)
})

test('an expired entry refetches', async t => {
  const cache = new TtlCache()
  let calls = 0
  const load = async () => {
    calls += 1
    return calls
  }

  t.is(await cache.wrap('k', -1, load), 1)
  t.is(await cache.wrap('k', -1, load), 2)
  t.is(calls, 2)
})

test('concurrent misses share a single upstream call', async t => {
  const cache = new TtlCache()
  let calls = 0
  const load = async () => {
    calls += 1
    await new Promise(resolve => setTimeout(resolve, 20))
    return 'value'
  }

  const results = await Promise.all([
    cache.wrap('k', 60, load),
    cache.wrap('k', 60, load),
    cache.wrap('k', 60, load)
  ])

  t.deepEqual(results, ['value', 'value', 'value'])
  t.is(calls, 1, 'the thundering herd must collapse into one request')
})

test('a failed refresh serves the last good value', async t => {
  const cache = new TtlCache()
  t.is(await cache.wrap('k', -1, async () => 'good'), 'good')

  const stale = await cache.wrap('k', -1, async () => {
    throw new Error('CKAN is down')
  })
  t.is(stale, 'good')
})

test('a failure with nothing cached propagates', async t => {
  const cache = new TtlCache()
  await t.throwsAsync(
    cache.wrap('k', 60, async () => {
      throw new Error('CKAN is down')
    }),
    { message: 'CKAN is down' }
  )
})

test('a failure does not pin the entry, so the next call retries', async t => {
  const cache = new TtlCache()
  let calls = 0
  const load = async () => {
    calls += 1
    if (calls === 1) throw new Error('transient')
    return 'recovered'
  }

  await t.throwsAsync(cache.wrap('k', 60, load))
  t.is(await cache.wrap('k', 60, load), 'recovered')
})
