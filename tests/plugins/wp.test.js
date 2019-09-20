const test = require('ava')
const wp = require('../../plugins/wp/cms')
const pages = require('../../plugins/ckan_pages/cms')
const config = require('../../config')
const mocks = require('../../fixtures')
const WPModel = new wp.CmsModel()

mocks.initMocks()

test('getPost api works', async t => {
  t.plan(1)

  const slug = 'about'
  const result = await WPModel.getPost(slug)

  t.is(result.title, 'Welcome to Data Service!')
})


test('getListOfPosts api works', async t => {
  t.plan(1)

  const result = await WPModel.getListOfPosts({
    "number": "10",
    "fields": "slug,title,content,date,modified,featured_image"
  })

  t.is(result.length, 2)
})


test('getListOfPosts api works for Pages', async t => {
  t.plan(1)

  const result = await WPModel.getListOfPosts({
    "number": "10",
    "fields": "slug,title,content,date,modified,featured_image"
  })

  t.is(result.length, 2)
})
