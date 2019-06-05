const test = require('ava')

var cms = require('../../lib/cms')
var mocks = require('../../fixtures')

mocks.initMocks()

const Model = new cms.CmsModel()


test('getPost api works', async t => {
  t.plan(1)

  const slug = 'about'
  const result = await Model.getPost(slug)

  t.is(result.title, 'Welcome to Data Service!')
})


test('getListOfPosts api works', async t => {
  t.plan(1)

  const result = await Model.getListOfPosts()

  t.is(result.length, 2)
})
