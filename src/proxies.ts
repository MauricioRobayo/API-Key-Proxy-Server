import querystring from 'querystring';
import config from './config';
import { Request } from 'express';
import { createProxyMiddleware, Options, Filter } from 'http-proxy-middleware';

const { allowedDomains: globalAllowedDomains = [], proxies } = config;

export default proxies.map(
  ({
    route,
    target,
    allowedDomains = [],
    allowedMethods = ['GET'],
    queryparams = {},
    headers = {},
    auth,
  }) => {
    const filter: Filter = (pathname: string, req: Request) => {
      if (typeof req.headers.origin === 'string') {
        return (
          pathname.startsWith(route) &&
          allowedMethods.includes(req.method) &&
          [...globalAllowedDomains, ...allowedDomains].includes(
            req.headers.origin
          )
        );
      }
      return false;
    };
    const options: Options = {
      target,
      changeOrigin: true,
      headers,
      auth,
      pathRewrite(path: string, req: Request) {
        const qp = querystring.stringify({
          ...req.query,
          ...queryparams,
        });
        const newPath = `${path.split('?')[0].replace(route, '')}?${qp}`;
        return newPath;
      },
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    };

    return createProxyMiddleware(filter, options);
  }
);
