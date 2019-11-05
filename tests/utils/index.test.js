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
  const result = utils.ckanViewToDataPackageView({
    "description": "This is a CKAN Classic view.",
    "title": "Data Explorer",
    "resource_id": "6ed8a2fb-f432-43ce-bae7-17684cf8a6bf",
    "view_type": "recline_view",
    "id": "b4eded84-7831-42cd-8b2b-2642b8168be3",
    "package_id": "51906c35-5f1b-42c6-834d-47566424cc57"
  })
  const expected = {
    "description": "This is a CKAN Classic view.",
    "title": "Data Explorer",
    "specType": "dataExplorer"
  }
  t.deepEqual(result, expected)
})
