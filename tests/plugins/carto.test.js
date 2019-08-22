const test = require('ava')
const pages = require('../../plugins/ckan_pages/cms')
const config = require('../../config')
const mocks = require('../../fixtures')
const PagesModel = new pages.CmsModel()

mocks.initMocks()

test('getPost api works for Pages', async t => {
  t.plan(1)

  const slug = 'test-page' 
  const result = await PagesModel.getPost(slug)

  t.is(result.title, 'CKAN Pages Test Page')
})


test('getListOfPosts api works for Pages', async t => {
  t.plan(1)

  const result = await PagesModel.getListOfPosts()

  t.is(result.length, 3)
})
