const fetch = require('node-fetch')
const moment = require('moment')
const config = require('../../config')
const dms = require('../../lib/dms')
const utils = require('../../utils')


module.exports = function (app) {
  app.get('/:owner/:name', async (req, res, next) => {
    const exceptions = ['news', 'group', 'organization', 'collections']
    if (exceptions.includes(req.params.owner)) {
      next()
      return
    }
    const Model = new dms.DmsModel(config)
    let datapackage = null

    try {
      datapackage = await Model.getPackage(req.params.name)
    } catch (err) {
      next(err)
      return
    }

    // Convert timestamps into human readable format:
    datapackage.resources[0].created = moment(datapackage.resources[0].created).format('MMMM Do, YYYY')
    datapackage.resources[0].last_modified = moment(datapackage.resources[0].last_modified).format('MMMM Do, YYYY')

    // Prep downloads property with various formats
    datapackage.downloads = [
      {
        format: 'CSV',
        path: datapackage.resources[0].path
      },
      {
        format: 'TSV',
        path: datapackage.resources[0].path + '?format=tsv'
      },
      {
        format: 'XLSX - Excel',
        path: datapackage.resources[0].path + '?bom=true'
      },
      {
        format: 'JSON',
        path: datapackage.resources[0].path + '?format=json'
      },
      {
        format: 'XML',
        path: datapackage.resources[0].path + '?format=xml'
      }
    ]

    // Prep resource e.g., make an inline datapackage and pass to renderer lib
    datapackage.resources[0].path = config.get('API_URL') + `datastore_search?resource_id=${datapackage.resources[0].id}`
    const response = await fetch(datapackage.resources[0].path)
    if (response.ok) {
      const result = await response.json()
      datapackage.resources[0].rows = result.result.total
      datapackage.resources[0].data = result.result.records.map(record => {
        delete record._id
        delete record._full_text
        return record
      })
    } else {
      // Data is unavailable
      datapackage.resources[0].unavailable = true
    }
    delete datapackage.resources[0].path
    // Resource format should be known tabular format for data previews to work
    // in EDS, all resources are in 'data' format which isn't valid for previewing
    datapackage.resources[0].format = 'csv'

    // This is hardcoded schema for gasflow dataset for a demo:
    if (datapackage.name === 'gasflow') {
      datapackage.resources[0].name = 'gasflow'
      const schema = {
        fields: [
          {
            name: 'GasDay',
            title: 'Gas Day',
            type: 'date',
            description: 'Gas Day is a period commencing at 06:00 CET on any day and ending at 06:00 CET on the following day. The Gas Day is reduced to 23 Hours at the transition to summer time and is increased to 25 Hours at the transition to winter time.',
            example: '2017-12-24',
            unit: 'Days'
          },
          {
            name: 'KWhFromBiogas',
            type: 'number'
          },
          {
            name: 'KWhToDenmark',
            type: 'number'
          },
          {
            name: 'KWhFromNorthSea',
            type: 'number'
          },
          {
            name: 'KWhToOrFromStorage',
            type: 'number'
          },
          {
            name: 'KWhToOrFromGermany',
            type: 'number'
          },
          {
            name: 'KWhToSweden',
            type: 'number'
          }
        ]
      }
      datapackage.resources[0].schema = schema
    }

    // Since "datapackage-views-js" library renders views according to
    // descriptor's "views" property, we need to generate view objects:
    datapackage.views = datapackage.views || []
    datapackage.resources.forEach((resource, index) => {
      // Convert bytes into human-readable format:
      resource.size = resource.size ? bytes(resource.size, {decimalPlaces: 0}) : resource.size
      const view = {
        id: index,
        title: resource.title || resource.name,
        resources: [
           resource.name
        ],
        specType: null
      }
      resource.format = resource.format.toLowerCase()
      // Add 'table' views for each tabular resource:
      const tabularFormats = ['csv', 'tsv', 'dsv', 'xls', 'xlsx']
      if (tabularFormats.includes(resource.format)) {
        view.specType = 'table'
      } else if (resource.format.includes('json')) {
        // Add 'map' views for each geo resource:
        view.specType = 'map'
      } else if (resource.format === 'pdf') {
        view.specType = 'document'
      }

      datapackage.views.push(view)
    })

    const profile = await Model.getProfile(req.params.owner)

    res.render('showcase.html', {
      title: req.params.owner + ' | ' + req.params.name,
      dataset: datapackage,
      owner: {
        name: profile.name,
        title: profile.title,
        description: utils.processMarkdown.render(profile.description),
        avatar: profile.image_display_url || profile.image_url
      },
      thisPageFullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      dpId: JSON.stringify(datapackage).replace(/'/g, "&#x27;")
    })
  })
}
