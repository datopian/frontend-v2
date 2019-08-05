module.exports = function (app) {
  const path = require('path')

  app.get('/map/:name', async (req, res) => {
    res.render(path.join(__dirname, '/views/map-page.html'), {})
  })
}
