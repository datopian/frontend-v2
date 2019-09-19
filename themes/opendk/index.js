module.exports = function (app) {
  const dms = app.get('dms')
  const config = app.get('config')
  const Model = new dms.DmsModel(config)

  app.get('/', async (req, res,next) => {
      const collections = await Model.getCollections()
      res.locals.collections = collections
      next()
  })
}