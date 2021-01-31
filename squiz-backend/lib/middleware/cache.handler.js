"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPrivateCacheControlToResp = exports.addCacheControlToResp = void 0;
// import path from 'path';
const config_1 = __importDefault(require("../config"));
const enum_1 = require("../shared/enum");
// import logger from '../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));
function addCacheControlToResp(resp, clientCacheBySeconds) {
    if (process.env.GOOGLE_CLOUD_PROJECT === enum_1.Environment.PROD) {
        const maxAge = clientCacheBySeconds || clientCacheBySeconds === 0 ? clientCacheBySeconds : config_1.default.search.cacheControl.maxAge;
        resp.set('Cache-Control', `public, max-age=${maxAge || 0}, s-maxage=${maxAge || 0}`);
        // we need to add vary on origin so hosting will cache another set based on origin,
        // else we will have CORS issues when our websites access a cached response.
        resp.set('Vary', 'Origin');
    }
}
exports.addCacheControlToResp = addCacheControlToResp;
function addPrivateCacheControlToResp(resp, clientCacheBySeconds) {
    const maxAge = clientCacheBySeconds || clientCacheBySeconds === 0 ? clientCacheBySeconds : config_1.default.search.cacheControl.maxAge;
    resp.set('Cache-Control', `private, max-age=${maxAge || 0}, s-maxage=${maxAge || 0}`);
    // we need to add vary on origin so hosting will cache another set based on origin,
    // else we will have CORS issues when our websites access a cached response.
    resp.set('Vary', 'Origin, Authorization');
}
exports.addPrivateCacheControlToResp = addPrivateCacheControlToResp;
//# sourceMappingURL=cache.handler.js.map