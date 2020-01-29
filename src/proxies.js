const proxy = require('http-proxy-middleware')
const querystring = require('querystring')
const config = require('./config')

module.exports = config.proxies.map(
  ({ route, queryparams, allowedDomains, allowedMethods, target }) => {
    const filter = (pathname, req) =>
      pathname === route &&
      allowedMethods.includes(req.method) &&
      allowedDomains.includes(req.headers.origin)
    const options = {
      target,
      changeOrigin: true,
      pathRewrite(path, req) {
        const qp = querystring.stringify({
          ...req.query,
          ...queryparams,
        })
        const newPath = path.split('?')[0].replace(route, `?${qp}`)
        return newPath
      },
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }

    return proxy(filter, options)
  },
)
