const path = require('path')


module.exports = function(app) {
  // Example of adding middleware
  app.use((req, res, next) => {
    res.header('x-my-custom-header', 1234)
    next()
  })

  // Example of adding a route and view
  app.get('/example-plugin-page', (req, res) => {
    return res.render(path.join(__dirname, 'views/example.html'), {
      variable: "A value from the controller"
    })
  })
}
