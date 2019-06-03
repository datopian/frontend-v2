'use strict'

const nconf = require('nconf')
require('dotenv').config()

nconf.argv()
  .env()

const api_url = process.env.API_URL || 'http://0.0.0.0:4000'

// This is the object that you want to override in your own local config
nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG || false,
  app: {
    port: process.env.PORT || 4000
  },
  API_URL: api_url,
  METASTORE_URL: process.env.METASTORE_URL || api_url,
  AUTH_URL: process.env.AUTH_URL || api_url,
  FLOWMANAGER_URL: process.env.FLOWMANAGER_URL || api_url,
  RESOLVER_URL: process.env.RESOLVER_URL || api_url,
  FILEMANAGER_URL: process.env.RESOLVER_URL || api_url,
  SITE_URL: process.env.SITE_URL || 'http://0.0.0.0:4000',
  BITSTORE_URL: process.env.BITSTORE_URL || 'http://127.0.0.1:4000/static/fixtures/'
})

module.exports = {
  get: nconf.get.bind(nconf),
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
}
