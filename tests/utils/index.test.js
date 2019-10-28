const test = require('ava')
const paginationFunction = require('../../utils/index').pagination


function macro(t, input, expected) {

  let currentPage = input[0]
  let lastPage = input[1]

  let pages = paginationFunction(currentPage, lastPage)

  t.deepEqual(pages, expected);
}

macro.title = (providedTitle = '[range with dots]', input, expected) =>
  `${providedTitle} current page: ${input[0]}, total pages: ${input[1]} => expected pages: [${expected}]`.trim()

test(macro, [1, 5], [1, 2, 3, 4, 5])
test(macro, [1, 20], [1, 2, 3, '...', 20])
test(macro, [2, 20], [1, 2, 3, 4, '...', 20])
test(macro, [10, 21], [1, '...', 8, 9, 10, 11, 12, '...', 21])
test(macro, [20, 21], [1, '...', 18, 19, 20, 21])
