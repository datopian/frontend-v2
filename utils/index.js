module.exports.ckanToDataPackage = function (descriptor) {
  // Make a copy
  const datapackage = JSON.parse(JSON.stringify(descriptor))

  // Lowercase name
  datapackage.name = datapackage.name.toLowerCase()

  // Rename notes => description
  if (datapackage.notes) {
    datapackage.description = datapackage.notes
    delete datapackage.notes
  }

  // Rename ckan_url => homepage
  if (datapackage.ckan_url) {
    datapackage.homepage = datapackage.ckan_url
    delete datapackage.ckan_url
  }

  // Parse license
  const license = {}
  if (datapackage.license_id) {
    license.type = datapackage.license_id
    delete datapackage.license_id
  }
  if (datapackage.license_title) {
    license.title = datapackage.license_title
    delete datapackage.license_title
  }
  if (datapackage.license_url) {
    license.url = datapackage.license_url
    delete datapackage.license_url
  }
  if (Object.keys(license).length > 0) {
    datapackage.license = license
  }

  // Parse author and sources
  const source = {}
  if (datapackage.author) {
    source.name = datapackage.author
    delete datapackage.author
  }
  if (datapackage.author_email) {
    source.email = datapackage.author_email
    delete datapackage.author_email
  }
  if (datapackage.url) {
    source.web = datapackage.url
    delete datapackage.url
  }
  if (Object.keys(source).length > 0) {
    datapackage.sources = [source]
  }

  // Parse maintainer
  const author = {}
  if (datapackage.maintainer) {
    author.name = datapackage.maintainer
    delete datapackage.maintainer
  }
  if (datapackage.maintainer_email) {
    author.email = datapackage.maintainer_email
    delete datapackage.maintainer_email
  }
  if (Object.keys(author).length > 0) {
    datapackage.author = author
  }

  // Parse tags
  if (datapackage.tags) {
    datapackage.keywords = []
    datapackage.tags.forEach(tag => {
      datapackage.keywords.push(tag.name)
    })
    delete datapackage.tags
  }

  // Parse extras
  // TODO

  // Resources
  datapackage.resources = datapackage.resources.map(resource => {
    if (resource.name) {
      resource.title = resource.title || resource.name
      resource.name = resource.name.toLowerCase().replace(/ /g, '_')
    } else {
      resource.name = resource.id
    }

    if (resource.url) {
      resource.path = resource.url
      delete resource.url
    }

    if (!resource.schema) {
      // TODO: add schema
    }

    return resource
  })

  return datapackage
}


module.exports.convertToStandardCollection = (descriptor) => {
  const standard = {
    name: '',
    title: '',
    summary: '',
    image: ''
  }

  standard.name = descriptor.name
  standard.title = descriptor.title || descriptor.display_name
  standard.summary = descriptor.description
  standard.image = descriptor.image_display_url || descriptor.image_url

  return standard
}


module.exports.convertToCkanSearchQuery = (query) => {
  const ckanQuery = {
    q: '',
    rows: '',
    start: '',
    sort: '',
    'facet.field': ['organization', 'groups', 'tags', 'res_format', 'license_id'],
    'facet.limit': 5
  }

  ckanQuery.q = query.q

  // standard 'size' => ckan 'rows'
  ckanQuery.rows = query.size || ''

  // standard 'from' => ckan 'start'
  ckanQuery.start = query.from || ''

  // standard 'sort' => ckan 'sort'
  const sortQueries = []
  if (query.sort && query.sort.constructor == Object) {
    for (let [key, value] of Object.entries(query.sort)) {
      sortQueries.push(`${key} ${value}`)
    }
    ckanQuery.sort = sortQueries.join(',')
  } else if (query.sort && query.sort.constructor == String) {
    ckanQuery.sort = query.sort.replace(':', ' ')
  } else if (query.sort && query.sort.constructor == Array) {
    query.sort.forEach(sort => {
      sortQueries.push(sort.replace(':', ' '))
    })
    ckanQuery.sort = sortQueries.join(',')
  }

  // Facets
  ckanQuery['facet.field'] = query['facet.field'] || ckanQuery['facet.field']
  ckanQuery['facet.limit'] = query['facet.limit'] || ckanQuery['facet.limit']

  // Remove attributes with empty string, null or undefined values
  Object.keys(ckanQuery).forEach((key) => (!ckanQuery[key]) && delete ckanQuery[key])

  return ckanQuery
}


module.exports.pagination = (c, m) => {
  let current = c,
      last = m,
      delta = 2,
      left = current - delta,
      right = current + delta + 1,
      range = [],
      rangeWithDots = [],
      l;

  range.push(1)
  for (let i = c - delta; i <= c + delta; i++) {
    if (i >= left && i < right && i < m && i > 1) {
      range.push(i);
    }
  }
  range.push(m)

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}


module.exports.processMarkdown = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})
