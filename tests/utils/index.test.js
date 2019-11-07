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
