const test = require('ava')
const request = require('supertest')

const mocks = require('../../fixtures')
mocks.initMocks()

const app = require('../../index').makeApp()


// CMS
test('About page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/about')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Welcome to Data Service!'))
})


test('News home page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/news')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('<!-- blog home page test placeholder -->'))
})


test('Single post page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/news/welcome-to-test-news-page')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Welcome to test news page'))
})


// DMS
test('Home page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Home'))
})


test('Search page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/search?q=co2')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Search'))
})


test('Showcase page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/dataset/co2emis')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('<!-- showcase page test placeholder -->'))
})


test('Redirect for org page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/organization/test_org_00')

  t.is(res.statusCode, 301)
  t.is(res.header['location'], '/test_org_00')
})


test('Organization page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/test_org_00')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('<img src="http://placekitten.com/g/200/100" class="img-responsive">'))
})


test('Redirect for collections page works', async t => {
  const res = await request(app)
    .get('/group/test-group')

  t.is(res.statusCode, 301)
  t.is(res.header['location'], '/collections/test-group')
})


test('Collections list page works', async t => {
  const res = await request(app)
    .get('/collections')

  t.true(res.text.includes('<!-- collections list page test placeholder -->'))
})


test('Collection page works', async t => {
  const res = await request(app)
    .get('/collections/test-group')

  t.true(res.text.includes('<!-- collection page test placeholder -->'))
})
