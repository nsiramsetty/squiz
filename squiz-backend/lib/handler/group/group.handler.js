"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupDifferenceHandler = exports.groupGetByIDHandler = exports.groupFilterHandler = exports.groupSearchHandler = void 0;
const group_difference_service_1 = require("../../service/group/group.difference.service");
const group_filter_service_1 = require("../../service/group/group.filter.service");
const group_get_service_1 = __importDefault(require("../../service/group/group.get.service"));
const group_search_service_1 = require("../../service/group/group.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function groupSearchHandler(cxt) {
    try {
        return await group_search_service_1.searchGroups(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.groupSearchHandler = groupSearchHandler;
async function groupFilterHandler(cxt) {
    try {
        return await group_filter_service_1.filterGroups(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.groupFilterHandler = groupFilterHandler;
async function groupGetByIDHandler(cxt) {
    try {
        return await group_get_service_1.default(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.groupGetByIDHandler = groupGetByIDHandler;
async function groupDifferenceHandler() {
    try {
        return await group_difference_service_1.differenceGroups();
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.groupDifferenceHandler = groupDifferenceHandler;
//# sourceMappingURL=group.handler.js.map