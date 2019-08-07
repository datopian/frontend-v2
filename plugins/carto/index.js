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
      const headerUrl= `${base}/${owner}/maps/master/${req.params.name}/header.html`
      const headerResponse = await fetch(headerUrl)
      const legendUrl= `${base}/${owner}/maps/master/${req.params.name}/legend.html`
      const legendResponse = await fetch(legendUrl)
      const filtersUrl = `${base}/${owner}/maps/master/${req.params.name}/filters.html`
      const filtersResponse = await fetch(filtersUrl)

      if (!configResponse.ok) {
        const message = await configResponse.text()
        res.status(configResponse.status)
        res.end(message)
        return
      }


      const configJson = await configResponse.json()
      const header = headerResponse.ok ? await headerResponse.text() : ""
      const filters = filtersResponse.ok ? await filtersResponse.text() : ""
      const legend = legendResponse.ok ? await legendResponse.text() : ""
      console.log(config)

      return res.render(path.join(__dirname, 'views/map-page.html'), {
        title: req.params.name,
        config: JSON.stringify(configJson),
        filters,
        legend,
        readme: header,
        type: configJson.type,
        iframeUrl: (configJson.type === "iframe") ? configJson.url : "",
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
