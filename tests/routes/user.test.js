const test = require("ava")
const request = require("supertest")
const mocks = require("../../fixtures")
mocks.initMocks()
const app = require("../../index").makeApp()
const config = require("../../config")

test("/signup route fails if user accounts are not enabled", async t => {
  let res = await request(app).get("/signup")

  t.is(res.statusCode, 404)
})

test("/login route works if user accounts are enabled", async t => {
  config.set("USER_ACCOUNTS_ENABLED", true)
  const app = require("../../index").makeApp()
  let res = await request(app).get("/login")

  t.is(res.statusCode, 200)
  t.is(true, res.text.includes("login"))
  t.is(true, res.text.includes("password"))
})

test("/signup route works", async t => {
  config.set("USER_ACCOUNTS_ENABLED", true)
  const app = require("../../index").makeApp()
  let res = await request(app).get("/signup")

  t.is(res.statusCode, 200)
  t.is(true, res.text.includes("Full Name"))
  t.is(true, res.text.includes("Confirm Password"))
})

test("signup submit validation error returns errors", async t => {
  config.set("USER_ACCOUNTS_ENABLED", true)
  const app = require("../../index").makeApp()

  let res = await request(app)
    .post("/signup")
    .send({ id: "", password: 123 })

  t.is(true, res.text.includes('Password field is required'))
})

// TODO login success shows dashboard page

// TODO login failure shows failure page

// todo logout page works

// todo signin creates session
