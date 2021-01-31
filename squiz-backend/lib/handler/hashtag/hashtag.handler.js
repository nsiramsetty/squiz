"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingHashtags = exports.hashtagsGetByIDHandler = exports.hashtagFilterHandler = exports.hashtagSearchHandler = void 0;
const hashtag_filter_service_1 = require("../../service/hashtag/hashtag.filter.service");
const hashtag_get_service_1 = __importDefault(require("../../service/hashtag/hashtag.get.service"));
const hashtag_search_service_1 = require("../../service/hashtag/hashtag.search.service");
const hashtag_trending_service_1 = require("../../service/hashtag/hashtag.trending.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function hashtagSearchHandler(cxt) {
    try {
        return await hashtag_search_service_1.searchHashtags(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.hashtagSearchHandler = hashtagSearchHandler;
async function hashtagFilterHandler(cxt) {
    try {
        return await hashtag_filter_service_1.filterHashtags(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.hashtagFilterHandler = hashtagFilterHandler;
async function hashtagsGetByIDHandler(cxt) {
    try {
        return await hashtag_get_service_1.default(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.hashtagsGetByIDHandler = hashtagsGetByIDHandler;
async function getTrendingHashtags(cxt) {
    try {
        return await hashtag_trending_service_1.trendingHashtags(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getTrendingHashtags = getTrendingHashtags;
//# sourceMappingURL=hashtag.handler.js.map