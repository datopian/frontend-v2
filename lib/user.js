"use strict"

const { resolve, URL } = require("url")
const fetch = require("node-fetch")
const utils = require("../utils")
const config = require("../config")

class UserModel {
  login = async body => {
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

  create = async body => {
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
}

module.exports.UserModel = UserModel
