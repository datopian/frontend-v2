var proxy = require('express-http-proxy')
const config = require('../../config')

module.exports = function(app) {
  const datastore = config.get('PROXY_DATASTORE')
  const filestore = config.get('PROXY_FILESTORE')

  if (datastore) {
    app.use(`/proxy/datastore`, proxy(datastore, {
      filter: function(req, res) {
       return req.method == 'GET'
      }
    }))
  }

  if (filestore) {
    app.use(`/proxy/filestore`, proxy(filestore, {
      filter: function(req, res) {
       return req.method == 'GET'
      }
    }))
  }
}
