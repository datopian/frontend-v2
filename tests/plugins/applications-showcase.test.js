const test = require('ava')
const request = require('supertest')
const config = require('../../config')
const mocks = require('../../fixtures')

mocks.initMocks()

test('get showcases list works', async t => {
  t.plan(2)
  config.set('PLUGINS', 'applications-showcase')
  const app = require('../../index').makeApp() 
  const res = await request(app)
    .get('/showcases')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Arbres Montréal'))
})

test('get showcase item works', async t => {
  t.plan(2)
  config.set('PLUGINS', 'applications-showcase')
  const app = require('../../index').makeApp() 
  const res = await request(app)
    .get('/showcases/single/25270967-2e34-4526-9e41-e099095bbf12')


  t.is(res.statusCode, 200)
  t.true(res.text.includes('Arbres Montréal'))
})
