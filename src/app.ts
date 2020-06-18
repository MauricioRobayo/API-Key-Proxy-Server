require('dotenv').config();
import express = require('express');
import { Request, Response, NextFunction } from 'express';
const debug = require('debug')('express:server');
const proxies = require('./proxies');

const app = express();

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
}

proxies.forEach((proxy: any) => app.use(proxy));
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => debug(`Listening on port ${port}`));
