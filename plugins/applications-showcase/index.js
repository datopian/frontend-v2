const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const config = require('../../config')
let configApiUrl = config.get("API_URL")

module.exports = function (app) {
  app.get('/showcases', async (req, res, next) => {
    try {
      const apiUrl = configApiUrl + 'ckanext_showcase_list'

      let response = await fetch(apiUrl)
      if (response.status !== 200) {
        throw response
      }

      let showcases = await response.json()

      return res.render(path.join(__dirname, 'views/application-showcases.html'), {
        title: 'Showcases',
        description: 'Showcases are any app, article or report that relate to the published dataset. For example, an annual report that contains aggregated information relating to the dataset or a website where there is further background information on the dataset or a link to an app that has been created utilising some or all of the dataset.',
        slug: 'showcases',
        showcases: showcases.result
      })
    } catch(e) {
      next(e)
    }
  })

  app.get('/showcases/single/:showcaseId', async (req, res, next) => {
    try {
      const id = req.params.showcaseId
      const apiUrl = configApiUrl + 'ckanext_showcase_show'

      // retrieving showcase
      let showcaseResponse = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          id: id
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (showcaseResponse.status !== 200) {
        throw showcaseResponse
      }

      let showcase = await showcaseResponse.json()

      // retrieving datasets
      let datasetsResponse = await fetch(configApiUrl + 'ckanext_showcase_package_list', {
        method: 'POST',
        body: JSON.stringify({
          showcase_id: id
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (datasetsResponse.status !== 200) {
        throw datasetsResponse
      }

      let datasets = await datasetsResponse.json()

      return res.render(path.join(__dirname, 'views/application-showcase.html'), {
        showcase: showcase.result,
        datasets: datasets.result
      })
    } catch(e) {
      next(e)
    }
  })
}
