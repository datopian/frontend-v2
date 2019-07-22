const test = require('ava')
const request = require('supertest')

const mocks = require('../../fixtures')
mocks.initMocks()

const app = require('../../index').makeApp()
const config = require('../../config')


// THEME
test('Theme defined route exists when THEME is set', async t => {
  config.set('THEME', 'example')
  const app = require('../../index').makeApp()
  const res = await request(app)
    .get('/foo')
  
  t.is(res.statusCode, 200)
  t.true(res.text.includes('Hello theme route'))
})


test('Theme defined route does NOT exists when THEME is not set', async t => {
  config.set('THEME', 'opendk')
  const app = require('../../index').makeApp()
  const res = await request(app)
    .get('/foo')
  
  t.is(res.statusCode, 500)
})


test('Missing theme load is caught and app still loads', async t => {
  config.set('THEME', "no-way-no-how")
  const app = require('../../index').makeApp()
  t.plan(1)

  const res = await request(app)
    .get('/')
  t.is(res.statusCode, 200)
})


// PLUGINS
// @@TODO Test load plugin from npm
test('User-plugin-provided res has expected custom header present', async t => {
  config.set('PLUGINS', "example cookie-parser")
  const app = require('../../index').makeApp()
  t.plan(1)

  const res = await request(app)
    .get('/')
  t.true(res.headers['x-my-custom-header'] === '1234')
})


test('Missing plugin load is caught and app still loads', async t => {
  config.set('PLUGINS', "no-way-no-how")
  const app = require('../../index').makeApp()
  t.plan(1)

  const res = await request(app)
    .get('/')
  t.is(res.statusCode, 200)
})




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
    .get('/test_org_00/co2emis')

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


test('Organization list page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/organization')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('<!-- collections list page test placeholder -->'))
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


// Not found tests
test('If a page is not found in neither CMS or DMS, it returns 404 page', async t => {
  const agent = request(app)
  let res = await agent
    .get('/not-found-slug')

  t.true(res.text.includes('<!-- placeholder for testing 404 page -->'))

  res = await agent
    .get('/collections/nonexistent-collection')

  t.true(res.text.includes('<!-- placeholder for testing 404 page -->'))

  res = await agent
    .get('/nonexistent-org/nonexistent-dataset')

  t.true(res.text.includes('<!-- placeholder for testing 404 page -->'))
})
