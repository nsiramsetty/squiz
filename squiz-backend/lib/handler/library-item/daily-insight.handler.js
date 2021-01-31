"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyInsightReviewsHandler = exports.dailyInsightPublisherProfileHandler = exports.dailyInsightGetByIDHandler = exports.dailyInsightFilterHandler = exports.dailyInsightSearchHandler = void 0;
const daily_insight_filter_service_1 = require("../../service/library-item/daily-insight/daily-insight.filter.service");
const daily_insight_get_service_1 = __importStar(require("../../service/library-item/daily-insight/daily-insight.get.service"));
const daily_insight_search_service_1 = require("../../service/library-item/daily-insight/daily-insight.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function dailyInsightSearchHandler(cxt) {
    try {
        return await daily_insight_search_service_1.searchDailyInsights(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.dailyInsightSearchHandler = dailyInsightSearchHandler;
async function dailyInsightFilterHandler(cxt) {
    try {
        return await daily_insight_filter_service_1.filterDailyInsight(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.dailyInsightFilterHandler = dailyInsightFilterHandler;
async function dailyInsightGetByIDHandler(cxt) {
    try {
        return await daily_insight_get_service_1.default(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.dailyInsightGetByIDHandler = dailyInsightGetByIDHandler;
async function dailyInsightPublisherProfileHandler(cxt) {
    try {
        return await daily_insight_get_service_1.getDailyInsightPublisherProfile(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.dailyInsightPublisherProfileHandler = dailyInsightPublisherProfileHandler;
async function dailyInsightReviewsHandler(cxt) {
    try {
        return await daily_insight_get_service_1.getDailyInsightReviews(cxt.getUrlParam('id'), cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.dailyInsightReviewsHandler = dailyInsightReviewsHandler;
//# sourceMappingURL=daily-insight.handler.js.map