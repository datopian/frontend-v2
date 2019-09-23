module.exports = function (app) {
  const dms = app.get('dms')
  const cms = app.get('cms')
  const config = app.get('config')
  const DmsModel = new dms.DmsModel(config)
  const CmsModel = new cms.CmsModel()

  app.use(async (req, res, next) => {
    // Get links for the navbar from CMS (WP)
    res.locals.aboutPages = (await CmsModel.getListOfPosts({type: 'page'}))
      .filter(page => page.parent && page.parent.ID === 11)
    next()
  })

  app.get('/', async (req, res, next) => {
    // Set up main heading text from config var:
    res.locals.home_heading = config.get('HOME_HEADING') || ''
    // Get collections with extras
    const collections = await DmsModel.getCollections({
      all_fields: true,
      include_extras: true,
      include_dataset_count: false
    })
    // Filter collections as we want to show only featured items
    const featured = collections.filter(collection => {
      return collection.extras.find(extra => extra.key === 'featured' && extra.value)
    })
    // Shuffle array
    let shuffled
    if (featured.length >= 4) {
      shuffled = featured.sort(() => 0.5 - Math.random())
    } else {
      shuffled = collections.sort(() => 0.5 - Math.random())
    }
    // Get sub-array of first n elements after shuffled
    const randomFour = shuffled.slice(0, 4)
    res.locals.collections = randomFour
    next()
  })
}
