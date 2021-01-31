import { NextFunction, Request, Response } from 'express';
// import path from 'path';
import { ParsedQs } from 'qs';
// import logger from '../logger';
import HTTP400Error from './http-400-error';
import HTTP404Error from './http-404-error';
import HTTPRequestBody from './http-request-body';

// const log = logger(path.relative(process.cwd(), __filename));

export default class HttpRequestContext {
  public request: Request;

  public response: Response;

  public next: NextFunction;

  public constructor(request: Request, response: Response, next: NextFunction) {
    this.request = request;
    this.response = response;
    this.next = next;
  }

  public getRequestParam(key: string): string | ParsedQs | string[] | ParsedQs[] {
    if (this.request.query) {
      if (this.request.query[key]) {
        return this.request.query[key];
      }
      throw new HTTP404Error(`Request Parameter ${key} not found.`);
    }
    throw new HTTP400Error('Empty Request Parameters');
  }

  public getRequestParams(): ParsedQs {
    if (this.request.query && Object.keys(this.request.query).length > 0) {
      return this.request.query;
    }
    return {};
  }

  public getUrlParam(key: string): string {
    if (this.request.params) {
      if (this.request.params[key]) {
        return this.request.params[key];
      }
      throw new HTTP404Error(`URL Parameter ${key} not found.`);
    }
    throw new HTTP400Error('Empty URL Parameters');
  }

  public getRequestBody(): HTTPRequestBody {
    if (this.request.body) {
      return this.request.body;
    }
    throw new HTTP400Error('Empty Request Body.');
  }
}
