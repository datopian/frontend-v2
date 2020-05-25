'use strict'

const nconf = require('nconf')
require('dotenv').config({path: process.env.DOTENV_PATH || '.env'})

nconf.argv()
  .env()

nconf.use('memory')

const api_url = (process.env.API_URL || 'http://127.0.0.1:5000/api/3/action/').replace(/\/?$/, '/')

// This is the object that you want to override in your own local config
nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG || false,
  app: {
    port: process.env.PORT || 4000
  },
  API_URL: api_url,
  SITE_URL: process.env.SITE_URL.replace(/\/+$/, '') || 'http://0.0.0.0:4000',
  SITE_LOCALE: process.env.SITE_LOCALE || 'en',
  WP_URL: process.env.WP_URL || 'http://127.0.0.1:6000',
  WP_BLOG_PATH: process.env.WP_BLOG_PATH || '/news',
  WP_TOKEN: process.env.WP_TOKEN || '',
  THEME_DIR: process.env.THEME_DIR || 'themes',
  NODE_MODULES_PATH: process.env.NODE_MODULES_PATH || 'node_modules',
  PLUGINS: process.env.FE_PLUGINS || '',
  PLUGIN_DIR: process.env.PLUGIN_DIR || 'plugins',
  SESSION_COOKIE_MAX_AGE: process.env.SESSION_COOKIE_MAX_AGE,
  SESSION_SECRET: process.env.SESSION_SECRET || 'keyboard cat',
  // CKAN pages PLUGIN
  CKAN_PAGES_URL: process.env.CKAN_PAGES_URL || api_url,
  // dashboard and maps PLUGIN
  GIT_BASE_URL: process.env.GIT_BASE_URL || 'https://raw.githubusercontent.com',
  // carto plugin
  CARTO_USER: process.env.CARTO_USER || '',
  CARTO_APIKEY: process.env.CARTO_APIKEY || 'default_public',
  // disqus
  DISQUS_PAGES: process.env.DISQUS_PAGES || '',
  kratos: {
    admin: process.env.KRATOS_ADMIN_URL && process.env.KRATOS_ADMIN_URL.replace(/\/+$/, ''),
    public: process.env.KRATOS_PUBLIC_URL && process.env.KRATOS_ADMIN_URL.replace(/\/+$/, '')
  }
})

module.exports = {
  get: nconf.get.bind(nconf),
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
}
