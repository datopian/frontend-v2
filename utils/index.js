const path = require('path')
const fs = require('fs')
const { URL } = require('url')
const bytes = require('bytes')
const slugify = require('slugify')
const config = require('../config')
const logger = require('./logger')

module.exports.ckanToDataPackage = function (datapackage) {
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
      // If 'fields' property exists use it as schema fields
      if (resource.fields) {
        if (typeof(resource.fields) === 'string') {
          try {
            resource.fields = JSON.parse(resource.fields)
          } catch (e) {
            logger.info('Could not parse resource.fields')
          }
        }
        resource.schema = {fields: resource.fields}
        delete resource.fields
      }
    }

    return resource
  })

  return datapackage
}

/*
  At the moment, we're considering only following examples of CKAN view:
  1. recline_view => Data Explorer with Table view, Chart Builder, Map Builder
    and Query Builder.
  2. geojson_view => Leaflet map
  3. pdf_view => our PDF viewer
  4. recline_grid_view => our Table viewer
  5. recline_graph_view => our Simple graph
  6. recline_map_view => our Leaflet map
  7. image_view => not supported at the moment
  8. text_view => not supported at the moment
  9. webpage_view => not supported at the moment
*/
module.exports.ckanViewToDataPackageView = (ckanView) => {
  const viewTypeToSpecType = {
    recline_view: 'dataExplorer', // from datastore data
    recline_grid_view: 'table',
    recline_graph_view: 'simple',
    recline_map_view: 'tabularmap',
    geojson_view: 'map',
    pdf_view: 'document',
    image_view: 'web',
    webpage_view: 'web',
    text_view: 'text'
  }
  const dataPackageView = JSON.parse(JSON.stringify(ckanView))
  dataPackageView.specType = viewTypeToSpecType[ckanView.view_type]
    || dataPackageView.specType
    || 'unsupported'

  if (dataPackageView.specType === 'dataExplorer') {
    dataPackageView.spec = {
      widgets: [
        {specType: 'table'},
        {specType: 'simple'},
        {specType: 'tabularmap'}
      ]
    }
  } else if (dataPackageView.specType === 'simple') {
    const graphTypeConvert = {
      lines: 'line',
      'lines-and-points': 'lines-and-points',
      points: 'points',
      bars: 'horizontal-bar',
      columns: 'bar'
    }
    dataPackageView.spec = {
      group: ckanView.group,
      series: Array.isArray(ckanView.series) ? ckanView.series : [ckanView.series],
      type: graphTypeConvert[ckanView.graph_type] || 'line'
    }
  } else if (dataPackageView.specType === 'tabularmap') {
    if (ckanView.map_field_type === 'geojson') {
      dataPackageView.spec = {
        geomField: ckanView.geojson_field
      }
    } else {
      dataPackageView.spec = {
        lonField: ckanView.longitude_field,
        latField: ckanView.latitude_field
      }
    }
  }

  return dataPackageView
}

/*
Takes single field descriptor from datastore data dictionary and coverts into
tableschema field descriptor.
*/
module.exports.dataStoreDataDictionaryToTableSchema = (dataDictionary) => {
  const internalDataStoreFields = ['_id', '_full_text', '_count']
  if (internalDataStoreFields.includes(dataDictionary.id)) {
    return null
  }
  const dataDictionaryType2TableSchemaType = {
    'text': 'string',
    'int': 'integer',
    'float': 'number',
    'date': 'date',
    'time': 'time',
    'timestamp': 'datetime',
    'bool': 'boolean',
    'json': 'object'
  }
  const field = {
    name: dataDictionary.id,
    type: dataDictionaryType2TableSchemaType[dataDictionary.type] || 'any'
  }
  if (dataDictionary.info) {
    const constraintsAttributes = ['required', 'unique', 'minLength', 'maxLength', 'minimum', 'maximum', 'pattern', 'enum']
    field.constraints = {}
    Object.keys(dataDictionary.info).forEach(key => {
      if (constraintsAttributes.includes(key)) {
        field.constraints[key] = dataDictionary.info[key]
      } else {
        field[key] = dataDictionary.info[key]
      }
    })
  }
  return field
}

module.exports.convertToStandardCollection = (descriptor) => {
  const standard = {
    name: '',
    title: '',
    summary: '',
    image: '',
    count: null
  }

  standard.name = descriptor.name
  standard.title = descriptor.title || descriptor.display_name
  standard.summary = descriptor.description || ''
  standard.image = descriptor.image_display_url || descriptor.image_url
  standard.count = descriptor.package_count || 0
  standard.extras = descriptor.extras || []
  standard.groups = descriptor.groups || []

  return standard
}


module.exports.convertToCkanSearchQuery = (query) => {
  const ckanQuery = {
    q: '',
    fq: '',
    rows: '',
    start: '',
    sort: '',
    'facet.field': ['organization', 'groups', 'tags', 'res_format', 'license_id'],
    'facet.limit': 5,
    'facet.mincount': 0
  }
  // Split by space but ignore spaces within double quotes:
  if (query.q) {
    query.q.match(/(?:[^\s"]+|"[^"]*")+/g).forEach(part => {
      if (part.includes(':')) {
        ckanQuery.fq += part + ' '
      } else {
        ckanQuery.q += part + ' '
      }
    })
    ckanQuery.fq = ckanQuery.fq.trim()
    ckanQuery.q = ckanQuery.q.trim()
  }

  if (query.fq) {
    ckanQuery.fq = ckanQuery.fq ? ckanQuery.fq + ' ' + query.fq : query.fq
  }

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
  ckanQuery['facet.mincount'] = query['facet.mincount'] || ckanQuery['facet.mincount']
  ckanQuery['facet.field'] = query['facet.field'] || ckanQuery['facet.field']

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

/**
 * Map CKAN metadata to standard jsonld schema (https://schema.org/Dataset) for 
 * google dataset discovery. 
**/
module.exports.packageJsonldGenerate = (pkg) => {
  const siteUrl = config.get('SITE_URL')

  const basicFields = {
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    name: pkg.title,
    description: pkg.description,
    url: `${siteUrl}/${pkg.organization.name}/${pkg.name}`,
    keywords: pkg.keywords,
    dateCreated: pkg.metadata_created,
    dateModified: pkg.metadata_modified,
  }

  const license = {
    '@type': 'CreativeWork',
    "name": pkg.license ? pkg.license.title : '',
    'url': pkg.license ? pkg.license.url : '',
  }

  const publisher = {
    "@type": "Organization",
    "sameAs": `${siteUrl}/${pkg.organization.name}/ `,
    "name": pkg.title
  }
  const distribution = pkg.resources.map(resource => {
    return {
      "@type": "DataDownload",
      encodingFormat: resource.format,
      contentUrl: resource.path
    }
  })

  const hasResource = pkg.resources.map(resource => {
    return {
      "@type": "Dataset",
      name: resource.title,
      description: resource.description,
      license: license,
      publisher: publisher,
      distribution: {
        "@type": "DataDownload",
        encodingFormat: resource.format.toUpperCase(),
        contentUrl: resource.path
      }
    }
  })

  return pkgJsonld = {
    ...basicFields,
    license: license,
    publisher: publisher,
    hasPart: hasResource,
    isAccessibleForFree: true,
    distribution: distribution
  }
}

/**
 * Look for user resource in configured directory
 * or in node_moduels directory
 **/
function loadExtension(extension, extensionsPath) {
  logger.info(extension) // stdout
  const nodeModulesPath = config.get('NODE_MODULES_PATH')
  const userResource = path.join(process.cwd(), extensionsPath, extension, 'index.js')
  const npmResource = path.join(process.cwd(), nodeModulesPath, extension)

  // look for plugin in user space
  if (fs.existsSync(userResource)) {
    return require(userResource)
  // otherwise look in node_modules
  } else if (fs.existsSync(npmResource)) {
    return require(extension)
  } else {
    // if all else fails give the user a helping hand
    throw new Error(`Cannot find configured extension -- ${extension}. Is it installed? If the extension is an npm module try to run\n"yarn add ${extension}"\nIf it is a user extension, make sure the the directory at ${extensionsPath} exists and there is a valid index.js file there.`)
  }
}

/**
 * Load configured theme from theme directory
 * or via node_modules
 **/
module.exports.loadTheme = function (app) {
  logger.info('Loading configured theme...')

  try {
    const theme = config.get('THEME')
    const themePath = config.get('THEME_DIR')
    if (!theme) return
    loadExtension(theme, themePath, 'theme')(app)
  } catch (e) {
    const theme = config.get('THEME')
    logger.warn('WARNING: Failed to load theme', theme, e)
  }
}

/**
 * Iterate over configured plugins and load via plugins directory
 * or via node_modules folder
 **/
module.exports.loadPlugins = function (app) {
  logger.info('Loading configured plugins...')

  try {
    const plugins = config.get('PLUGINS')
    const pluginPath = config.get('PLUGIN_DIR')

    if (!plugins) return

    // try to load each resource
    return plugins.split(' ').forEach(plugin => {
      loadExtension(plugin, pluginPath, 'plugin')(app)
    })
  } catch (e) {
    const plugins = config.get('PLUGINS').split(" ") || []
    logger.warn('WARNING: Failed to load configured plugins', plugins, e)
    return []
  }
}


/**
 * Process data package attributes prior to display to users.
 * Process markdown
 * Convert bytes to human readable format
 * etc.
 **/
module.exports.processDataPackage = function (datapackage) {
  if (datapackage.description) {
    datapackage.descriptionHtml = module.exports.processMarkdown
      .render(datapackage.description || '')
  }

  if (datapackage.readme) {
    datapackage.readmeHtml = module.exports.processMarkdown
      .render(datapackage.readme || '')
  }

  datapackage.formats = datapackage.formats || []
  // Per each resource:
  datapackage.resources.forEach(resource => {
    if (resource.description) {
      resource.descriptionHtml = module.exports.processMarkdown
        .render(resource.description || '')
    }
    // Normalize format (lowercase)
    if (resource.format) {
      resource.format = resource.format.toLowerCase()
      datapackage.formats.push(resource.format)
    }

    // Convert bytes into human-readable format:
    if (resource.size) {
      resource.sizeFormatted = bytes(resource.size, {decimalPlaces: 0})
    }
  })

  return datapackage
}


/**
 * Create 'displayResources' property which has:
 * resource: Object containing resource descriptor
 * api: API URL for the resource if available, e.g., Datastore
 * proxy: path via proxy for the resource if available
 * cc_proxy: path via CKAN Classic proxy if available
 * slug: slugified name of a resource
 **/
module.exports.prepareResourcesForDisplay = function (datapackage) {
  datapackage.displayResources = []
  datapackage.resources.forEach((resource, index) => {
    const api = resource.datastore_active
      ? config.get('API_URL') + 'datastore_search?resource_id=' + resource.id + '&sort=_id asc'
      : null
    // Use proxy path if datastore/filestore proxies are given:
    let proxy, cc_proxy
    try {
      if (resource.path) {
        const resourceUrl = new URL(resource.path)
        if (resourceUrl.host === config.get('PROXY_DATASTORE') && resource.format !== 'pdf') {
          proxy = '/proxy/datastore' + resourceUrl.pathname + resourceUrl.search
        }
        if (resourceUrl.host === config.get('PROXY_FILESTORE') && resource.format !== 'pdf') {
          proxy = '/proxy/filestore' + resourceUrl.pathname + resourceUrl.search
        }
        // Store a CKAN Classic proxy path
        // https://github.com/ckan/ckan/blob/master/ckanext/resourceproxy/plugin.py#L59
        const apiUrlObject = new URL(config.get('API_URL'))
        cc_proxy = apiUrlObject.origin + `/dataset/${datapackage.id}/resource/${resource.id}/proxy`
      }
    } catch (e) {
      logger.warn(e)
    }
    const displayResource = {
      resource,
      api, // URI for getting the resource via API, e.g., Datastore. Useful when you want to fetch only 100 rows or similar.
      proxy, // alternative for path in case there is CORS issue
      cc_proxy,
      slug: slugify(resource.name) + '-' + index // Used for anchor links
    }
    datapackage.displayResources.push(displayResource)
  })

  return datapackage
}


/**
 * Prepare 'views' property which is used by 'datapackage-views-js' library to
 * render visualizations such as tables, graphs and maps.
 **/
module.exports.prepareViews = function (datapackage) {
  datapackage.views = datapackage.views || []
  datapackage.resources.forEach(resource => {
    const resourceViews = resource.views && resource.views.map(view => {
      view.resources = [resource.name]
      return view
    })

    datapackage.views = datapackage.views.concat(resourceViews)
  })

  return datapackage
}


/**
 * Create 'dataExplorers' property which is used by 'data-explorer' library to
 * render data explorer widgets.
 **/
module.exports.prepareDataExplorers = function (datapackage) {
  datapackage.displayResources.forEach((displayResource, idx) => {
    datapackage.displayResources[idx].dataExplorers = []
    displayResource.resource.views && displayResource.resource.views.forEach(view => {
      const widgets = []
      if (view.specType === 'dataExplorer') {
        view.spec.widgets.forEach((widget, index) => {
          const widgetNames = {
            table: 'Table',
            simple: 'Chart',
            tabularmap: 'Map'
          }
          widget = {
            name: widgetNames[widget.specType] || 'Widget-' + index,
            active: index === 0 ? true : false,
            datapackage: {
              views: [
                {
                  id: view.id,
                  specType: widget.specType
                }
              ]
            }
          }
          widgets.push(widget)
        })
      } else {
        const widget = {
          name: view.title || '',
          active: true,
          datapackage: {
            views: [view]
          }
        }
        widgets.push(widget)
      }

      displayResource.resource.api = displayResource.resource.api || displayResource.api
      const dataExplorer = JSON.stringify({
        widgets,
        datapackage: {
          resources: [displayResource.resource]
        }
      }).replace(/'/g, "&#x27;")
      datapackage.displayResources[idx].dataExplorers.push(dataExplorer)
    })
  })

  return datapackage
}

