const test = require('ava')
const {GaApi} = require('../../plugins/google-analytics/api')
const mocks = require('../../fixtures')


mocks.initMocks()

process.env.GA_ID = 'UA-12345678-9'
process.env.GA_VIEW_ID = '123456789'

let gaApi = new GaApi()
gaApi.jwt = "some test string"

test('ga api get works', async t => {
  t.plan(2)

  const params = {
    'start-date': '30daysAgo',
    'end-date': 'today',
    'sort': '-ga:uniquePageviews',
    'dimensions': 'ga:pagePathLevel2',
    'metrics': 'ga:uniquePageviews',
    'max-results': 30,
    'filters': 'ga:pagePathLevel1==/dataset/'
  }

  const result = await gaApi.get(params)
  
  t.is(result.status, 200)
  t.is(result.data.totalResults, 109)
})