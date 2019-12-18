const proxy = require('http-proxy-middleware')
const querystring = require('querystring')

// The route this proxy will match
const context = '/ipinfo'

// The list of domains allowed to request to the proxy
const allowedDomains = ['https://mauriciorobayo.github.io']

const filter = (pathname, req) => {
  return (
    pathname.match(`^${context}$`) &&
    req.method === 'GET' &&
    allowedDomains.includes(req.headers.origin)
  )
}

const options = {
  target: 'https://ipinfo.io/',
  changeOrigin: true,
  pathRewrite(path, req) {
    const queryparams = querystring.stringify({
      ...req.query,
      token: process.env.IPINFO_API_KEY,
    })
    const newPath = path.split('?')[0].replace(context, `?${queryparams}`)
    return newPath
  },
  logLevel: 'info', // change to 'debug' for more info
}

module.exports = proxy(filter, options)
