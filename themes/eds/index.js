const fetch = require('node-fetch')
const moment = require('moment')
const config = require('../../config')
const dms = require('../../lib/dms')
const utils = require('../../utils')
const multer  = require('multer')
const nodemailer = require('nodemailer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


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

    // Resource format should be known tabular format for data previews to work
    // in EDS, all resources are in 'data' format which isn't valid for previewing
    datapackage.resources[0].format = 'csv'

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
      dpId: JSON.stringify(datapackage).replace(/\\/g, '\\\\').replace(/\'/g, "\\'")//.replace(/'/g, "&#x27;")
    })
  })
  app.get('/open-door-lab', async (req, res, next) => {
      res.render('open-door-lab.html', {
        title: 'Open Door Lab',
    })
  })

  app.post('/open-door-lab',upload.single('attachment'), async (req, res, next) => {
    try {
      if ((!config.get('SMTP_SERVICE')    &&
        (!config.get('SMTP_HOST')       ||
          !config.get('SMTP_PORT')))    ||
        !config.get('EMAIL_FROM')       ||
        !config.get('EMAIL_PASSWORD')   ||
        !config.get('EMAIL_TO')) {
        next({status: 500, message: 'One of the environment variables are not set for mailer plugin.'})
        return
      }

      let transporter = nodemailer.createTransport({
        service: config.get('SMTP_SERVICE'),
        host: config.get('SMTP_HOST'),
        port: config.get('SMTP_PORT'),
        auth: {
          user: config.get('EMAIL_FROM'),
          pass: config.get('EMAIL_PASSWORD')
        }
      })

      let mailSubject = 'Open Door Lab'
      let mailBody = 'Name: ' + req.body.username + '\n'
      mailBody += 'subject: ' + req.body.subject + '\n'
      mailBody += 'Idea: ' + req.body.ideaDetail + '\n'

      let mailOptions = {
        from: config.get('EMAIL_FROM'),
        to: config.get('EMAIL_TO'),
        subject: mailSubject,
        text: mailBody,
        attachments: [
          {
            filename: req.file.originalname,
            content: req.file.buffer.toString('base64'),
            encoding: 'base64'
          },
        ]
      }

      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          next({status: 500, message: err})
          return
        } else {
          res.send({status: 200})
        }
      })
    } catch (err) {
      next({ status: 500, message: err })
    }


  })

}
