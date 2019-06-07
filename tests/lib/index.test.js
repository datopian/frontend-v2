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


test('Search api works', async t => {
  t.plan(1)

  const result = await DmsModel.search('q=co2')

  t.is(result.count, 1)
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


test('getListOfCollections api works', async t => {
  t.plan(1)

  const result = await DmsModel.getListOfCollections()

  t.is(result.length, 1)
})
