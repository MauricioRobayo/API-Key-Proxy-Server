const proxy = require('http-proxy-middleware')
const querystring = require('querystring')

// The route this proxy will match
const context = '/ipinfo'

// The list of domains allowed to request to the proxy
const allowedDomains = ['https://mauriciorobayo.github.io']

if (process.env.NODE_ENV === 'development') {
  allowedDomains.push('http://localhost:8080')
}

const filter = (pathname, req) =>
  pathname.match(`^${context}$`) &&
  req.method === 'GET' &&
  allowedDomains.includes(req.headers.origin)

const options = {
  target: 'https://ipinfo.io/',
  changeOrigin: true,
  pathRewrite(path, req) {
    const queryparams = querystring.stringify({
      ...req.query,
      token: process.env.IPINFO_API_KEY, // add the `token` with the API KEY
    })
    const newPath = path.split('?')[0].replace(context, `?${queryparams}`)
    return newPath
  },
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
}

module.exports = proxy(filter, options)
