module.exports = function(app) {
  app.use((req, res, next) => {
    console.log("EXAMPLE PLUGIN LOGGER {req query}:", req.query)
    res.header('x-my-custom-header', 1234)
    next()
  })
}
