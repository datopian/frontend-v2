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
  const result = await PagesModel.getListOfPages()

  t.is(result.length, 4)
  t.is(result[0].title, 'Page One Title')
  t.is(result[1].name, 'page-two')
  t.is(result[2].content, 'Page Three Content')
})
