const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const config = require('../../config')


module.exports = function (app) {
  app.get('/dashboards/:name', async (req, res, next) => {
    try {
      let base = config.get('GIT_BASE_URL')
      base = base.endsWith('/') ? base.slice(0, -1) : base
      const owner = config.get('GIT_OWNER')
      const configUrl = `${base}/${owner}/dashboards/master/${req.params.name}/config.json`
      const pageUrl = `${base}/${owner}/dashboards/master/${req.params.name}/index.html`
      const configResponse = await fetch(configUrl)
      const pageResponse = await fetch(pageUrl)
      if (!configResponse.ok) {
        const message = await configResponse.text()
        res.status(configResponse.status)
        res.end(message)
        return
      } else if (!pageResponse.ok) {
        const message = await pageResponse.text()
        res.status(pageResponse.status)
        res.end(message)
        return
      }
      const configJson = await configResponse.json()
      const htmlSnippet = await pageResponse.text()
      return res.render(path.join(__dirname, 'views/dashboard.html'), {
        title: req.params.name,
        htmlSnippet,
        configJson
      })
    } catch(e) {
      next(e)
    }

  })
}
