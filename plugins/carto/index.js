const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const config = require('../../config')


module.exports = function (app) {
  app.get('/maps/:name', async (req, res, next) => {
    try {
      let base = config.get('GIT_BASE_URL')
      base = base.endsWith('/') ? base.slice(0, -1) : base
      const owner = config.get('GIT_OWNER')
      const configUrl = `${base}/${owner}/maps/master/${req.params.name}/config.json`
      const configResponse = await fetch(configUrl)
      if (!configResponse.ok) {
        const message = await configResponse.text()
        res.status(configResponse.status)
        res.end(message)
        return
      } 
      const configJson = await configResponse.json()
      return res.render(path.join(__dirname, 'views/map-page.html'), {
        title: req.params.name,
        config: JSON.stringify(configJson),
        auth: {
          username: process.env.CARTO_USERNAME,
          apiKey: process.env.CARTO_KEY
        }
      })
    } catch(e) {
      next(e)
    }
  })
}
