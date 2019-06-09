const test = require('ava')

const cms = require('../../lib/cms')
const dms = require('../../lib/dms')
const config = require('../../config')
const mocks = require('../../fixtures')

mocks.initMocks()

const CmsModel = new cms.CmsModel()
const DmsModel = new dms.DmsModel(config)


test('getPost api works', async t => {
  t.plan(1)

  const slug = 'about'
  const result = await CmsModel.getPost(slug)

  t.is(result.title, 'Welcome to Data Service!')
})


test('getListOfPosts api works', async t => {
  t.plan(1)

  const result = await CmsModel.getListOfPosts()

  t.is(result.length, 2)
})


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
    results: [],
    count: 0,
    sort: 'name asc',
    facets: {},
    search_facets: {}
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
    title: 'Test group',
    summary: 'New description',
    image: ''
  }

  t.deepEqual(result, expected)
})
