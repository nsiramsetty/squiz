/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
// import path from 'path';
import config from '../config';
import { Environment } from '../shared/enum';
// import logger from '../shared/logger';

// const log = logger(path.relative(process.cwd(), __filename));

export function addCacheControlToResp(resp: Response, clientCacheBySeconds?: number): void {
  if (process.env.GOOGLE_CLOUD_PROJECT === Environment.PROD) {
    const maxAge =
      clientCacheBySeconds || clientCacheBySeconds === 0 ? clientCacheBySeconds : config.search.cacheControl.maxAge;
    resp.set('Cache-Control', `public, max-age=${maxAge || 0}, s-maxage=${maxAge || 0}`);
    // we need to add vary on origin so hosting will cache another set based on origin,
    // else we will have CORS issues when our websites access a cached response.
    resp.set('Vary', 'Origin');
  }
}

export function addPrivateCacheControlToResp(resp: Response, clientCacheBySeconds?: number): void {
  const maxAge =
    clientCacheBySeconds || clientCacheBySeconds === 0 ? clientCacheBySeconds : config.search.cacheControl.maxAge;
  resp.set('Cache-Control', `private, max-age=${maxAge || 0}, s-maxage=${maxAge || 0}`);
  // we need to add vary on origin so hosting will cache another set based on origin,
  // else we will have CORS issues when our websites access a cached response.
  resp.set('Vary', 'Origin, Authorization');
}
