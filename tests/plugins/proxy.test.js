const test = require('ava')
const request = require('supertest')
const config = require('../../config')
const mocks = require('../../fixtures')

mocks.initMocks()

test('proxy works', async t => {
  config.set('PLUGINS', 'proxy')
  config.set('PROXY_DATASTORE', '127.0.0.1:5000')
  const app = require('../../index').makeApp()

  const res = await request(app)
    .get('/proxy/datastore/api/3/action/datastore_search?resource_id=gdp&limit=5')

  t.is(res.statusCode, 200)
  t.is(JSON.parse(res.text).result.records.length, 5)
})
