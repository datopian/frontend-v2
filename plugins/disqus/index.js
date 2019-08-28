const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const config = require('../../config')
let configApiUrl = config.get("API_URL")

module.exports = function (app) {
  app.use((req, res, next) => {
    let disqusPages = "," + config.get('DISQUS_PAGES') + ",";
    let currentUrl = "," + req.url + ",";

    res.locals.disqusEnabled = disqusPages.includes(currentUrl);
    res.locals.PAGE_URL =
    res.locals.PAGE_IDENTIFIER = req.url;

    next();
  });
};