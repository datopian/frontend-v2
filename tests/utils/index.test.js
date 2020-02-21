const test = require('ava')
const utils = require('../../utils/index')


// Pagination
function macro(t, input, expected) {

  let currentPage = input[0]
  let lastPage = input[1]

  let pages = utils.pagination(currentPage, lastPage)

  t.deepEqual(pages, expected);
}

macro.title = (providedTitle = '[range with dots]', input, expected) =>
  `${providedTitle} current page: ${input[0]}, total pages: ${input[1]} => expected pages: [${expected}]`.trim()

test(macro, [1, 5], [1, 2, 3, 4, 5])
test(macro, [1, 20], [1, 2, 3, '...', 20])
test(macro, [2, 20], [1, 2, 3, 4, '...', 20])
test(macro, [10, 21], [1, '...', 8, 9, 10, 11, 12, '...', 21])
test(macro, [20, 21], [1, '...', 18, 19, 20, 21])
// End of Pagination

test('Convert CKAN view to data package view', t => {
  // Data Explorer
  let result = utils.ckanViewToDataPackageView({
    'description': 'This is a CKAN Classic view.',
    'title': 'Data Explorer',
    'resource_id': '6ed8a2fb-f432-43ce-bae7-17684cf8a6bf',
    'view_type': 'recline_view',
    'id': 'b4eded84-7831-42cd-8b2b-2642b8168be3',
    'package_id': '51906c35-5f1b-42c6-834d-47566424cc57'
  })
  let expected = {
    'description': 'This is a CKAN Classic view.',
    'title': 'Data Explorer',
    'resource_id': '6ed8a2fb-f432-43ce-bae7-17684cf8a6bf',
    'view_type': 'recline_view',
    'id': 'b4eded84-7831-42cd-8b2b-2642b8168be3',
    'package_id': '51906c35-5f1b-42c6-834d-47566424cc57',
    'specType': 'dataExplorer',
    'spec': {
      'widgets': [
        {specType: 'table'},
        {specType: 'simple'},
        {specType: 'tabularmap'}
      ]
    }
  }
  t.deepEqual(result, expected)

  // Recline graph
  result = utils.ckanViewToDataPackageView({
    title: 'Recline graph',
    view_type: 'recline_graph_view',
    graph_type: 'lines',
    group: 'x',
    series: 'y'
  })
  expected = {
    title: 'Recline graph',
    view_type: 'recline_graph_view',
    graph_type: 'lines',
    group: 'x',
    series: 'y',
    specType: 'simple',
    spec: {
      group: 'x',
      series: ['y'],
      type: 'line'
    }
  }
  t.deepEqual(result, expected)

  // Recline grid
  result = utils.ckanViewToDataPackageView({
    title: 'Recline grid',
    view_type: 'recline_grid_view'
  })
  expected = {
    title: 'Recline grid',
    view_type: 'recline_grid_view',
    specType: 'table'
  }
  t.deepEqual(result, expected)

  // Recline map
  result = utils.ckanViewToDataPackageView({
    title: 'Recline map',
    view_type: 'recline_map_view',
    map_field_type: 'geojson',
    geojson_field: 'abc'
  })
  expected = {
    title: 'Recline map',
    view_type: 'recline_map_view',
    map_field_type: 'geojson',
    geojson_field: 'abc',
    specType: 'tabularmap',
    spec: {
      geomField: 'abc'
    }
  }
  t.deepEqual(result, expected)

  // Web etc.
  result = utils.ckanViewToDataPackageView({
    title: 'Web view',
    view_type: 'webpage_view',
    page_url: 'http://example.com'
  })
  expected = {
    title: 'Web view',
    view_type: 'webpage_view',
    page_url: 'http://example.com',
    specType: 'web'
  }
  t.deepEqual(result, expected)

  // unsupported
  result = utils.ckanViewToDataPackageView({
    title: 'Unsupported view',
    view_type: 'xxx'
  })
  expected = {
    title: 'Unsupported view',
    view_type: 'xxx',
    specType: 'unsupported'
  }
  t.deepEqual(result, expected)
})


const datapackage = {
  name: 'test',
  id: 'dp-id',
  description: '# Dataset',
  readme: '# Readme',
  resources: [
    {
      name: 'resource-1',
      description: '# Resource',
      format: 'CSV',
      size: 2312414,
      datastore_active: true,
      id: 'resource-1-id',
      path: 'https://datastore.com/resource-1-id',
      views: [{name: 'view-1-1'}, {name: 'view-1-2'}],
      fields: "[{\"type\": \"any\", \"name\": \"Field Name\"}]"
    },
    {
      name: 'resource-2',
      path: 'https://datastore.com/resource-2-id',
      views: [{name: 'view-2-1', specType: 'dataExplorer'}]
    },
    {
      name: 'resource-3',
      path: 'https://datastore.com/resource-3-id',
      views: []
    }
  ]
}


test('Prepare data package for display', t => {
  const result = utils.processDataPackage(datapackage)
  t.true(result.descriptionHtml.includes('<h1>Dataset</h1>'))
  t.true(result.readmeHtml.includes('<h1>Readme</h1>'))
  t.true(result.resources[0].descriptionHtml.includes('<h1>Resource</h1>'))
  t.is(result.resources[0].format, 'csv')
  t.is(result.resources[0].sizeFormatted, '2MB')
})


test('Prepare resources for display', t => {
  const result = utils.prepareResourcesForDisplay(datapackage)
  t.is(result.displayResources.length, datapackage.resources.length)
  t.is(result.displayResources[0].api, 'http://127.0.0.1:5000/api/3/action/datastore_search?resource_id=resource-1-id')
  t.is(result.displayResources[0].cc_proxy, 'http://127.0.0.1:5000/dataset/dp-id/resource/resource-1-id/proxy')
})


test('Prepare data package views', t => {
  const result = utils.prepareViews(datapackage)
  t.is(result.views.length, 3)
  t.deepEqual(result.views[1].resources, ['resource-1'])
})


test('resource.fields => resource.schema', t => {
  const result = utils.ckanToDataPackage(datapackage)
  const expectedSchema = {
    fields: [
      {name: 'Field Name', type: 'any'}
    ]
  }
  t.deepEqual(result.resources[0].schema, expectedSchema)
})


test('datastore data dictionary => tableschema', t => {
  let result = utils.dataStoreDataDictionaryToTableSchema({
    id: 'column',
    type: 'text'
  })

  let expected = {
    name: 'column',
    type: 'string'
  }

  t.deepEqual(result, expected)

  result = utils.dataStoreDataDictionaryToTableSchema({
    id: 'column',
    type: 'text',
    info: {
      title: 'Column',
      minLength: 5,
      maxLength: 10
    }
  })

  expected = {
    name: 'column',
    type: 'string',
    title: 'Column',
    constraints: {
      minLength: 5,
      maxLength: 10
    }
  }

  t.deepEqual(result, expected)
})
