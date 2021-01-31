import { NextFunction, Request, Response } from 'express';
import path from 'path';
import config from '../config';

import logger from '../shared/logger';
import responseBuilder from '../helper/response.builder';
import HTTPClientError from '../shared/http/http-client-error';
import HTTP500Error from '../shared/http/http-500-error';
import { LogLevel } from '../shared/enum';

const log = logger(path.relative(process.cwd(), __filename));

export default (error: Error, req: Request, res: Response, next: NextFunction): void => {
  log.error(`${error.stack}`);
  if (config.gae.logs.level !== LogLevel.DEBUG) {
    Object.assign(error, { stackTrace: '' });
  }
  const httpClientError: HTTPClientError =
    error instanceof HTTPClientError
      ? error
      : new HTTP500Error(error.message, config.gae.logs.level === LogLevel.DEBUG ? error.stack : '');
  if (res.headersSent) {
    next(error);
  }
  responseBuilder.defaultHTTPErrorResponse(res, httpClientError);
};
