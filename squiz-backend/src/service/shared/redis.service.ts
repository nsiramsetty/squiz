/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { JsonObject } from 'swagger-ui-express';
import config from '../../config/index';
import RedisConfigService from '../../config/utils/redis.config';
import responseBuilder from '../../helper/response.builder';
import { errorHandler } from '../../middleware';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { RedisConfig } from '../../model/shared/redis.model';
import HttpRequestContext from '../../shared/http/http-request-context';
import logger from '../../shared/logger';

const REDIS_CACHE_DURATION = config.search.redisCacheControl.cacheDuration;
const REDIS_RECACHE_INTERVAL = config.search.redisCacheControl.recacheInterval;
const REDIS_KEY_PREFIX = config.search.redisKeyPrefix;
const log = logger(path.relative(process.cwd(), __filename));

const redisClient = RedisConfigService.getRedisClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCacheById(key: string): JsonObject {
  return new Promise((resv, rej): any => {
    redisClient.get(key, (err, reply): any => {
      if (err) {
        rej(err);
      }
      if (reply) {
        resv(JSON.parse(reply));
      } else {
        resv(null);
      }
    });
  });
}

export function setCache(redisKey: string, cacheDuration: number, body: JsonObject): void {
  redisClient.setex(redisKey, cacheDuration, JSON.stringify(body), (error): any => {
    if (error) {
      log.error(`redis:set:${redisKey} ${error}`);
    }
  });
}

export function redisRecached(
  redisKey: string,
  cacheDuration: number,
  recacheInterval: number,
  callback: Function,
  context: HttpRequestContext,
): void {
  redisClient.ttl(
    redisKey,
    async (ttlErr, ttl): Promise<any> => {
      if (ttl && ttl < cacheDuration - recacheInterval) {
        const response = await callback(context);
        log.info(`data recached : ${redisKey}`);
        setCache(redisKey, REDIS_CACHE_DURATION, response);
      }
    },
  );
}

export async function redisListResponse(
  req: Request,
  res: Response,
  next: NextFunction,
  callback: Function,
  redisConfig?: RedisConfig,
  isCDNCached: boolean = true,
  clientCacheSeconds?: number,
): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    try {
      const result = await callback(new HttpRequestContext(req, res, next));
      responseBuilder.searchResultsResponse(res, result, isCDNCached, clientCacheSeconds);
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  } else {
    const redisKey = `${REDIS_KEY_PREFIX}${req.originalUrl || req.url}`;
    let response;
    try {
      response = (await getCacheById(redisKey)) as ResponseWrapperModel<UnifiedSearchResponse>;
    } catch (error) {
      log.info(`redis failed : ${redisKey}`);
      const result = await callback(new HttpRequestContext(req, res, next));
      responseBuilder.searchResultsResponse(res, result, isCDNCached, clientCacheSeconds);
      return;
    }
    try {
      if (!response) {
        const result = await callback(new HttpRequestContext(req, res, next));
        setCache(redisKey, redisConfig?.cacheDuration || REDIS_CACHE_DURATION, result);
        log.info(`records returned from es: ${redisKey}`);
        responseBuilder.searchResultsResponse(res, result, isCDNCached, clientCacheSeconds);
      } else {
        redisRecached(
          redisKey,
          redisConfig?.cacheDuration || REDIS_CACHE_DURATION,
          redisConfig?.recacheInterval || REDIS_RECACHE_INTERVAL,
          callback,
          new HttpRequestContext(req, res, next),
        );
        log.info(`records returned from redis cache: ${redisKey}`);
        responseBuilder.searchResultsResponse(res, response, isCDNCached, clientCacheSeconds);
      }
    } catch (error) {
      if (response) {
        log.info(`Error found so existing cache data returned: ${redisKey}`);
        responseBuilder.searchResultsResponse(res, response, isCDNCached, clientCacheSeconds);
      } else {
        errorHandler(error, req, res, next);
      }
    }
  }
}

export async function redisObjectResponse(
  req: Request,
  res: Response,
  next: NextFunction,
  callback: Function,
  isCDNCached: boolean = true,
  clientCacheSeconds?: number,
): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    try {
      const result = await callback(new HttpRequestContext(req, res, next));
      responseBuilder.defaultHTTPSuccessResponse(res, result, isCDNCached, clientCacheSeconds);
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  } else {
    const redisKey = `${REDIS_KEY_PREFIX}${req.originalUrl || req.url}`;
    let response;
    try {
      response = (await getCacheById(redisKey)) as ResponseWrapperModel<UnifiedSearchResponse>;
    } catch (error) {
      log.info(`redis failed: ${redisKey}`);
      const result = await callback(new HttpRequestContext(req, res, next));
      responseBuilder.defaultHTTPSuccessResponse(res, result, isCDNCached, clientCacheSeconds);
      return;
    }
    try {
      if (!response) {
        const result = await callback(new HttpRequestContext(req, res, next));
        setCache(redisKey, REDIS_CACHE_DURATION, result);
        log.info(`records returned from es: ${redisKey}`);
        responseBuilder.defaultHTTPSuccessResponse(res, result, isCDNCached, clientCacheSeconds);
      } else {
        redisRecached(
          redisKey,
          REDIS_CACHE_DURATION,
          REDIS_RECACHE_INTERVAL,
          callback,
          new HttpRequestContext(req, res, next),
        );
        log.info(`records returned from redis cache: ${redisKey}`);
        responseBuilder.defaultHTTPSuccessResponse(res, response, isCDNCached, clientCacheSeconds);
      }
    } catch (error) {
      if (response) {
        log.debug(`Error found so existing cache data returned: ${redisKey}`);
        responseBuilder.defaultHTTPSuccessResponse(res, response, isCDNCached, clientCacheSeconds);
      } else {
        errorHandler(error, req, res, next);
      }
    }
  }
}
