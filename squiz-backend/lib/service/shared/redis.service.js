"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisObjectResponse = exports.redisListResponse = exports.redisRecached = exports.setCache = exports.getCacheById = void 0;
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../../config/index"));
const redis_config_1 = __importDefault(require("../../config/utils/redis.config"));
const response_builder_1 = __importDefault(require("../../helper/response.builder"));
const middleware_1 = require("../../middleware");
const http_request_context_1 = __importDefault(require("../../shared/http/http-request-context"));
const logger_1 = __importDefault(require("../../shared/logger"));
const REDIS_CACHE_DURATION = index_1.default.search.redisCacheControl.cacheDuration;
const REDIS_RECACHE_INTERVAL = index_1.default.search.redisCacheControl.recacheInterval;
const REDIS_KEY_PREFIX = index_1.default.search.redisKeyPrefix;
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
const redisClient = redis_config_1.default.getRedisClient();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCacheById(key) {
    return new Promise((resv, rej) => {
        redisClient.get(key, (err, reply) => {
            if (err) {
                rej(err);
            }
            if (reply) {
                resv(JSON.parse(reply));
            }
            else {
                resv(null);
            }
        });
    });
}
exports.getCacheById = getCacheById;
function setCache(redisKey, cacheDuration, body) {
    redisClient.setex(redisKey, cacheDuration, JSON.stringify(body), (error) => {
        if (error) {
            log.error(`redis:set:${redisKey} ${error}`);
        }
    });
}
exports.setCache = setCache;
function redisRecached(redisKey, cacheDuration, recacheInterval, callback, context) {
    redisClient.ttl(redisKey, async (ttlErr, ttl) => {
        if (ttl && ttl < cacheDuration - recacheInterval) {
            const response = await callback(context);
            log.info(`data recached : ${redisKey}`);
            setCache(redisKey, REDIS_CACHE_DURATION, response);
        }
    });
}
exports.redisRecached = redisRecached;
async function redisListResponse(req, res, next, callback, redisConfig, isCDNCached = true, clientCacheSeconds) {
    if (process.env.NODE_ENV === 'development') {
        try {
            const result = await callback(new http_request_context_1.default(req, res, next));
            response_builder_1.default.searchResultsResponse(res, result, isCDNCached, clientCacheSeconds);
        }
        catch (error) {
            middleware_1.errorHandler(error, req, res, next);
        }
    }
    else {
        const redisKey = `${REDIS_KEY_PREFIX}${req.originalUrl || req.url}`;
        let response;
        try {
            response = (await getCacheById(redisKey));
        }
        catch (error) {
            log.info(`redis failed : ${redisKey}`);
            const result = await callback(new http_request_context_1.default(req, res, next));
            response_builder_1.default.searchResultsResponse(res, result, isCDNCached, clientCacheSeconds);
            return;
        }
        try {
            if (!response) {
                const result = await callback(new http_request_context_1.default(req, res, next));
                setCache(redisKey, (redisConfig === null || redisConfig === void 0 ? void 0 : redisConfig.cacheDuration) || REDIS_CACHE_DURATION, result);
                log.info(`records returned from es: ${redisKey}`);
                response_builder_1.default.searchResultsResponse(res, result, isCDNCached, clientCacheSeconds);
            }
            else {
                redisRecached(redisKey, (redisConfig === null || redisConfig === void 0 ? void 0 : redisConfig.cacheDuration) || REDIS_CACHE_DURATION, (redisConfig === null || redisConfig === void 0 ? void 0 : redisConfig.recacheInterval) || REDIS_RECACHE_INTERVAL, callback, new http_request_context_1.default(req, res, next));
                log.info(`records returned from redis cache: ${redisKey}`);
                response_builder_1.default.searchResultsResponse(res, response, isCDNCached, clientCacheSeconds);
            }
        }
        catch (error) {
            if (response) {
                log.info(`Error found so existing cache data returned: ${redisKey}`);
                response_builder_1.default.searchResultsResponse(res, response, isCDNCached, clientCacheSeconds);
            }
            else {
                middleware_1.errorHandler(error, req, res, next);
            }
        }
    }
}
exports.redisListResponse = redisListResponse;
async function redisObjectResponse(req, res, next, callback, isCDNCached = true, clientCacheSeconds) {
    if (process.env.NODE_ENV === 'development') {
        try {
            const result = await callback(new http_request_context_1.default(req, res, next));
            response_builder_1.default.defaultHTTPSuccessResponse(res, result, isCDNCached, clientCacheSeconds);
        }
        catch (error) {
            middleware_1.errorHandler(error, req, res, next);
        }
    }
    else {
        const redisKey = `${REDIS_KEY_PREFIX}${req.originalUrl || req.url}`;
        let response;
        try {
            response = (await getCacheById(redisKey));
        }
        catch (error) {
            log.info(`redis failed: ${redisKey}`);
            const result = await callback(new http_request_context_1.default(req, res, next));
            response_builder_1.default.defaultHTTPSuccessResponse(res, result, isCDNCached, clientCacheSeconds);
            return;
        }
        try {
            if (!response) {
                const result = await callback(new http_request_context_1.default(req, res, next));
                setCache(redisKey, REDIS_CACHE_DURATION, result);
                log.info(`records returned from es: ${redisKey}`);
                response_builder_1.default.defaultHTTPSuccessResponse(res, result, isCDNCached, clientCacheSeconds);
            }
            else {
                redisRecached(redisKey, REDIS_CACHE_DURATION, REDIS_RECACHE_INTERVAL, callback, new http_request_context_1.default(req, res, next));
                log.info(`records returned from redis cache: ${redisKey}`);
                response_builder_1.default.defaultHTTPSuccessResponse(res, response, isCDNCached, clientCacheSeconds);
            }
        }
        catch (error) {
            if (response) {
                log.debug(`Error found so existing cache data returned: ${redisKey}`);
                response_builder_1.default.defaultHTTPSuccessResponse(res, response, isCDNCached, clientCacheSeconds);
            }
            else {
                middleware_1.errorHandler(error, req, res, next);
            }
        }
    }
}
exports.redisObjectResponse = redisObjectResponse;
//# sourceMappingURL=redis.service.js.map