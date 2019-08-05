const test = require('ava')
const dms = require('../../lib/dms')
const config = require('../../config')
const mocks = require('../../fixtures')

mocks.initMocks()

const DmsModel = new dms.DmsModel(config)


test('Search api works - simple case', async t => {
  t.plan(1)

  const result = await DmsModel.search({q: 'co2'})

  t.is(result.count, 1)
})


test('Search api works - full case', async t => {
  t.plan(1)

  const result = await DmsModel.search(
    {
      q: 'co2 res_format:CSV',
      size: 10,
      from: 10,
      sort: {
        name: 'asc'
      }
    }
  )

  const expected = {
    count: 0,
    facets: {
      groups: {},
      license_id: {},
      organization: {},
      res_format: {},
      tags: {},
    },
    results: [],
    search_facets: {
      groups: {
        items: [],
        title: 'groups',
      },
      license_id: {
        items: [],
        title: 'license_id',
      },
      organization: {
        items: [],
        title: 'organization',
      },
      res_format: {
        items: [],
        title: 'res_format',
      },
      tags: {
        items: [],
        title: 'tags',
      },
    },
    sort: 'name asc',
  }

  t.deepEqual(result, expected)
})


test('getPackage api works', async t => {
  t.plan(1)

  const result = await DmsModel.getPackage('co2emis')

  t.is(result.name, 'co2emis')
})


test('getProfile api works', async t => {
  t.plan(1)

  const result = await DmsModel.getProfile('test_org_00')

  t.is(result.created, '2019-03-27T21:26:27.501417')
})


test('getCollections (list of collections) api works', async t => {
  t.plan(1)

  const result = await DmsModel.getCollections()

  t.is(result.length, 1)
})


test('getCollection api works', async t => {
  t.plan(1)

  const name = 'test-group'
  const result = await DmsModel.getCollection(name)

  const expected = {
    name: name,
    title: 'Economic Data',
    summary: 'A collection of economic indicators available on DataHub.',
    image: 'https://datahub.io/static/img/awesome-data/economic-data.png',
    count: 2
  }

  t.deepEqual(result, expected)
})


test('getOrganizations api works', async t => {
  t.plan(1)

  const result = await DmsModel.getOrganizations()

  t.is(result.length, 1)
})
