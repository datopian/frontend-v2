module.exports = function(app) {
  const config = require('../config')
  const { url, resolve } = require("url")
  const fetch = require("node-fetch")
  const proxy = require("express-http-proxy")
  const { check, validationResult } = require("express-validator")
  const { sanitizeBody } = require("express-validator/filter")

  //  don't enable routes unless user accounts enabled in config
  if (config.get("USER_ACCOUNTS_ENABLED")) {
    const doAPILogin = async body => {
      const action = "user_login"
      const url = new URL(resolve(config.get("API_URL"), action))
      const params = {
        id: body.username,
        password: body.password
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.get("API_KEY")
          },
          body: JSON.stringify(params)
        })

        const APIResponse = await response.json()

        return APIResponse && APIResponse.result
      } catch (e) {
        console.error("Error getting logged in user", e)
        return false
      }
    }

    const doAPIUserCreate = async body => {
      const action = "user_create"
      const url = new URL(resolve(config.get("API_URL"), action))
      const params = Object.assign({}, body, { name: body.username })
      const API_KEY = config.get("API_KEY")

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: API_KEY
          },
          body: JSON.stringify(params)
        })

        const json = await response.json()

        return json
      } catch (e) {
        console.error("Error getting logged in user", e)
        return false
      }
    }

    app.use((req, res, next) => {
      res.locals.ckan_user = req.session.ckan_user
      next()
    })

    app.get("/login", (req, res, next) => {
      res.render("user/login.html")
    })

    app.post("/login", async (req, res) => {
      check("username", "Username is required").isLength(1)
      check("password", "Password is required").isLength(1)

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        // TODO create response object and re-render login page
        return res.status(422).json({ errors: errors.array() })
      } else {
        try {
          const loggedUser = await doAPILogin(req.body)
          if (loggedUser) {
            req.session.ckan_user = loggedUser
            res.redirect("/profile")
          } else {
            res.redirect("/login-failure")
          }
        } catch (e) {
          console.warn("Login via login form failed with exception", e)
          // TODO handle error here
        }
      }
    })

    app.get("/logout", (req, res) => {
      req.session.ckan_user = false
      res.redirect("/")
    })

    app.get("/signup", (req, res, next) => {
      res.render("user/signup.html")
    })

    app.post(
      "/signup",
      [
        check("username", "Username is required").isLength(2),
        check(
          "fullname",
          "Full name must be a least 2 characters long"
        ).isLength(2),
        check("email", "Please enter a valid email").isLength(3),
        check("password", "Password field is required")
          .isLength({ min: 10 })
          .custom((value, { req, loc, path }) => {
            if (value !== req.body.confirmPassword) {
              // trow error if passwords do not match
              throw new Error("Passwords don't match")
            } else {
              return value
            }
          })
      ],
      async (req, res) => {
        const validation = validationResult(req)
        
        if (!validation.isEmpty()) {
          const result = validation.errors.reduce((acc, cur) => {
            const name = cur.param
            acc[cur.param] = acc[cur.param] || {}
            acc[name].value = cur.value || req.body[name]
            acc[name].msg = acc[name].msg
              ? `${acc[name].msg}, ${cur.msg}`
              : cur.msg
            return acc
          }, {})

          // format submitted vals for form template
          const allVals = Object.keys(req.body).reduce((acc, key) => {
            acc[key] = { value: req.body[key] }
            return acc
          }, {})

          const r = Object.assign({}, allVals, result)

          return res.render("user/signup.html", r)
        } else {
          // if local form validation succeeds, continue to API:
          const APIResponse = await doAPIUserCreate(req.body)

          // handle errors
          if (APIResponse.error) {
            // preserve entered form values
            const allVals = Object.keys(req.body).reduce((acc, key) => {
              acc[key] = { value: req.body[key] }
              return acc
            }, {})

            const locals = Object.assign({}, allVals, {
              APIError: APIResponse.error
            })

            // render signup form with API Error
            return res.render("user/signup.html", locals)
          } else {
            // success!
            const newUser = APIResponse.result
            req.session.ckan_user = newUser
            res.redirect("/profile")
          }
        }
      }
    )

    app.get("/profile", (req, res) => {
      if (!req.session.ckan_user) res.redirect("/")
      res.render("user/profile.html", { user: req.session.ckan_user })
    })

    app.get("/login-failure", (req, res) => {
      res.render("user/login-failure.html")
    })
  }
}
