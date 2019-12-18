const proxy = require('http-proxy-middleware')
const querystring = require('querystring')

// The route this proxy will match
const context = '/weather'

// The list of domains allowed to request to the proxy
// Do not include a path or a trailing slash
const allowedDomains = ['https://mauriciorobayo.github.io']

const filter = (pathname, req) => {
  return (
    pathname.match(`^${context}$`) &&
    req.method === 'GET' &&
    allowedDomains.includes(req.headers.origin)
  )
}

const options = {
  target: 'https://api.openweathermap.org',
  changeOrigin: true,
  pathRewrite(path, req) {
    const queryparams = querystring.stringify({
      ...req.query,
      appid: process.env.WEATHER_API_KEY,
    })
    const newPath = path
      .split('?')[0]
      .replace(context, `/data/2.5/weather?${queryparams}`)
    return newPath
  },
  logLevel: 'info', // change to 'debug' for more info
}

module.exports = proxy(filter, options)
