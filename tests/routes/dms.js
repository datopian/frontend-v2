const test = require('ava')
const request = require('supertest')

const mocks = require('../../fixtures')
mocks.initMocks()

const app = require('../../index').makeApp()
let agent = null


test.beforeEach(async t => {
  agent = request(app)
})


test('Home page works', async t => {
  t.plan(2)

  const res = await agent
    .get('/')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Home'))
})


test('Search page works', async t => {
  t.plan(2)

  const res = await agent
    .get('/search?q=co2')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Search'))
})


test('Showcase page works', async t => {
  t.plan(2)

  const res = await agent
    .get('/dataset/co2emis')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('dataset | co2emis'))
})
