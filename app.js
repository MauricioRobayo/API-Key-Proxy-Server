const express = require('express')
const debug = require('debug')('express:server')
const weatherProxy = require('./proxies/weather-proxy')

require('dotenv').config()

const app = express()

app.use(weatherProxy)

function notFound(req, res, next) {
  res.status(404)
  const error = new Error('Not Found')
  next(error)
}

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500)
  res.json({
    message: error.message,
  })
}

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => debug(`Listening on port ${port}`))
