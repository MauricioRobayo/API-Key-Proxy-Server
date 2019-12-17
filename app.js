const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fetch = require('node-fetch')

require('dotenv').config()

const app = express()
app.use(morgan('tiny'))

const allowedOrigins = ['https://mauriciorobayo.github.io']
const corsOptions = {
  origin(origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.get('/weather', cors(corsOptions), (req, res) => {
  const API_URL = 'https://api.openweathermap.org/'
  const API_ENDPOINT = '/data/2.5/weather'
  const url = new URL(API_ENDPOINT, API_URL)

  url.search = new URLSearchParams({
    ...req.query,
    appid: process.env.WEATHER_API_KEY,
  }).toString()
  fetch(url.href)
    .then(response => response.json())
    .then(json => res.json(json))
})

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
app.listen(port, () => console.log(`Listening on port ${port}`))
