"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventGetByIDHandler = exports.homeCarouselEventsHandler = exports.eventFilterHandler = exports.eventSearchHandler = void 0;
const event_filter_service_1 = require("../../service/event/event.filter.service");
const event_get_service_1 = __importDefault(require("../../service/event/event.get.service"));
const event_search_service_1 = require("../../service/event/event.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function eventSearchHandler(cxt) {
    try {
        return await event_search_service_1.searchEvents(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.eventSearchHandler = eventSearchHandler;
async function eventFilterHandler(cxt) {
    try {
        return await event_filter_service_1.filterEvents(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.eventFilterHandler = eventFilterHandler;
async function homeCarouselEventsHandler() {
    try {
        return await event_filter_service_1.getHomeCarouselEvents();
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.homeCarouselEventsHandler = homeCarouselEventsHandler;
async function eventGetByIDHandler(cxt) {
    try {
        return await event_get_service_1.default(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.eventGetByIDHandler = eventGetByIDHandler;
//# sourceMappingURL=event.handler.js.map