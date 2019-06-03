const test = require('ava')
const request = require('supertest')

const app = require('../../index').makeApp()


test('Home page works', async t => {
  t.plan(2)

  const res = await request(app)
    .get('/')

  t.is(res.statusCode, 200)
  t.true(res.text.includes('Home'))
})
