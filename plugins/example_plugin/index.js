module.exports = function(app) {
  app.use((req, res, next) => {
    console.log("EXAMPLE PLUGIN LOGGER {req query}:", req.query)
    next()
  })
}
