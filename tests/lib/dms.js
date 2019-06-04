const test = require('ava')

var config = require('../../config')
var dms = require('../../lib/dms')
var mocks = require('../../fixtures')

mocks.initMocks()

const Model = new dms.DmsModel(config)


test('Search api works', async t => {
  t.plan(1)

  const result = await Model.search('q=co2')

  t.is(result.count, 1)
})


test('getPackage api works', async t => {
  t.plan(1)

  const result = await Model.getPackage('co2emis')

  t.is(result.name, 'co2emis')
})
