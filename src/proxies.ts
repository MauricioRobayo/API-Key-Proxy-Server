import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Request } from 'express';
import {
  createProxyMiddleware,
  Options,
  Filter,
  RequestHandler,
} from 'http-proxy-middleware';
import config from './config';

const { allowedDomains: globalAllowedDomains = [], proxies } = config;

const proxiesMiddlewares: RequestHandler[] = proxies.map((options) => {
  const {
    route,
    allowedDomains = [],
    allowedMethods = ['GET'],
    queryparams = {},
    changeOrigin = true,
    ...rest
  } = options;

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

  const httpProxyMiddlewareOptions: Options = {
    ...rest,
    changeOrigin,
    pathRewrite(path: string, req: Request) {
      const qp = querystring.stringify({
        ...req.query,
        ...queryparams,
      } as ParsedUrlQueryInput);
      const newPath = `${path.split('?')[0].replace(route, '')}?${qp}`;
      return newPath;
    },
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  };

  return createProxyMiddleware(filter, httpProxyMiddlewareOptions);
});

export default proxiesMiddlewares;
