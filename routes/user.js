"use strict"
const express = require("express")
const { resolve, URL } = require('url')
const config = require("../config")
const fetch = require('node-fetch')

module.exports = function(app) {
  const router = express.Router()

  // TODO remove
  app.use((req, res, next) => {
    console.log("sess", req.session)
    next()
  })

  app.get("/signup", (req, res) => {
    res.render("signup.html")
  })

  app.get("/login", (req, res) => {
    res.render("login.html")
  })

  app.get("/logout", (req, res) => {
    // kill user token
    req.session.ckan_user = {}
    res.redirect("/")
  })

  app.get('foobar', (req, res) => {
    res.send('Hello foobar')
  })

  app.post("/login-form-submit", async (req, res) => {
    console.log("Login submit", req.body)
    
    // TODO validate form here
    
    // TODO endpoints should be generic, or configured
    const action = "national_grid_user_login"
    const url = new URL(resolve(config.get('API_URL'), action))
    const params = {
        id: req.body.username,
        password: req.body.password
      }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': config.get('API_KEY')
        },
        body: JSON.stringify(params)
      })

      const body = await response.json()
      console.log(body)
      req.session.ckan_user = body.result 
    } catch (e) {
      console.error('Error getting logged in user', e)
    }

    /* req.session.ckan_user = { */
    /*   email_hash: "2ab10b220889a2ddc3a2ffe27688b83c", */
    /*   about: null, */
    /*   apikey: "REDACTED", */
    /*   display_name: "REDACTED", */
    /*   name: "REDACTED", */
    /*   created: "2019-11-20T10:54:23.186088", */
    /*   id: "886811d2-15e6-4460-b1c6-86d6f78352bd", */
    /*   sysadmin: true, */
    /*   activity_streams_email_notifications: false, */
    /*   state: "active", */
    /*   number_of_edits: 0, */
    /*   fullname: null, */
    /*   email: "REDACTED", */
    /*   number_created_packages: 0 */
    /* } */

    res.redirect("/")
  })

  app.post("/signup-form-submit", (req, res) => {
    // TODO - validate form
    // TODO -- call user_create handle res
    console.log(req.body)

    res.redirect("/")
  })

  return router
}
