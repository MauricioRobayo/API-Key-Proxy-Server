import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';
import express from 'express';
import { resolve } from 'path';
import { config } from 'dotenv';
// This needs to be before proxies so that module also has access to .env
config({ path: resolve(__dirname, '../.env') });
import proxiesMiddlewares from './proxies';

const debug = Debug('express:server');
const app = express();

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
}

function errorHandler(error: Error, req: Request, res: Response) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
}

proxiesMiddlewares.forEach((proxyMiddleware) => app.use(proxyMiddleware));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => debug(`Listening on port ${port}`));
