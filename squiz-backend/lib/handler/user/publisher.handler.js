"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublisherLiveEventsHandler = exports.getPublisherGratitudeWallHandler = exports.getPublisherLibraryItemsHandler = exports.getPublisherDailyInsightsHandler = exports.getPublisherCoursesHandler = exports.getPublisherPlaylistsHandler = exports.getPublisherHandler = exports.publisherFilterHandler = exports.publisherSearchHandler = void 0;
const transform_service_1 = __importDefault(require("../../service/shared/transform.service"));
const publisher_filter_service_1 = require("../../service/user/publisher/publisher.filter.service");
const publisher_get_service_1 = require("../../service/user/publisher/publisher.get.service");
const publisher_search_service_1 = require("../../service/user/publisher/publisher.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function publisherSearchHandler(cxt) {
    try {
        return await publisher_search_service_1.searchPublishers(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.publisherSearchHandler = publisherSearchHandler;
async function publisherFilterHandler(cxt) {
    try {
        return await publisher_filter_service_1.filterPublishers(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.publisherFilterHandler = publisherFilterHandler;
async function getPublisherHandler(cxt) {
    try {
        return await publisher_get_service_1.getPublisher(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getPublisherHandler = getPublisherHandler;
async function getPublisherPlaylistsHandler(cxt) {
    try {
        const resultsFromES = await publisher_get_service_1.getPublisherPlaylists(cxt.getUrlParam('id'), cxt.getRequestParams());
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getPublisherPlaylistsHandler = getPublisherPlaylistsHandler;
async function getPublisherCoursesHandler(cxt) {
    try {
        const resultsFromES = await publisher_get_service_1.getPublisherCourses(cxt.getUrlParam('id'));
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getPublisherCoursesHandler = getPublisherCoursesHandler;
async function getPublisherDailyInsightsHandler(cxt) {
    try {
        const resultsFromES = await publisher_get_service_1.getPublisherDailyInsights(cxt.getUrlParam('id'));
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getPublisherDailyInsightsHandler = getPublisherDailyInsightsHandler;
async function getPublisherLibraryItemsHandler(cxt) {
    try {
        const resultsFromES = await publisher_get_service_1.getPublisherLibraryItems(cxt.getUrlParam('id'), cxt.getRequestParams());
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getPublisherLibraryItemsHandler = getPublisherLibraryItemsHandler;
async function getPublisherGratitudeWallHandler(cxt) {
    try {
        return await publisher_get_service_1.getPublisherGratitudeWall(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getPublisherGratitudeWallHandler = getPublisherGratitudeWallHandler;
async function getPublisherLiveEventsHandler(cxt) {
    try {
        const resultsFromES = await publisher_get_service_1.getPublisherLiveEvents(cxt.getUrlParam('id'));
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getPublisherLiveEventsHandler = getPublisherLiveEventsHandler;
//# sourceMappingURL=publisher.handler.js.map