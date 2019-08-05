module.exports = function (app) {
  const fs = require('fs')
  const path = require('path')
  const fetch = require('node-fetch')
  const config = require('../../config')

  app.get('/dashboard/:name', async (req, res) => {
    const base = config.get('GITHUB_BASEURL')
    const username = config.get('GITHUB_USERNAME')
    const prefix = config.get('DASH_PREFIX')
    const url = `${base}/${username}/${prefix}_${req.params.name}/master/dashboard.json`
    console.log("URL", url)
    const response = await fetch(url)
    const data = await response.text()
    
    res.render(path.join(__dirname, '/views/dash.html'), {
      title: req.params.name,
      dashData: data
    })
  })
}
