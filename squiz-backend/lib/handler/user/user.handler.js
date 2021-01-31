"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFriendsHandler = exports.getUserFollowersHandler = exports.getUserFollowingsHandler = exports.getUserGroupsHandler = exports.getUserCoursesHandler = exports.userGetByIDHandler = exports.userSearchHandler = void 0;
const transform_service_1 = __importDefault(require("../../service/shared/transform.service"));
const user_get_service_1 = require("../../service/user/user/user.get.service");
const user_search_service_1 = __importDefault(require("../../service/user/user/user.search.service"));
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
// import logger from '../../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));
async function userSearchHandler(cxt) {
    try {
        return await user_search_service_1.default(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.userSearchHandler = userSearchHandler;
async function userGetByIDHandler(cxt) {
    try {
        return await user_get_service_1.getUser(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.userGetByIDHandler = userGetByIDHandler;
async function getUserCoursesHandler(cxt) {
    try {
        const resultsFromES = await user_get_service_1.getUserCourses(cxt.getUrlParam('id'));
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getUserCoursesHandler = getUserCoursesHandler;
async function getUserGroupsHandler(cxt) {
    try {
        const resultsFromES = await user_get_service_1.getUserGroups(cxt.getUrlParam('id'), cxt.getRequestParams());
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getUserGroupsHandler = getUserGroupsHandler;
async function getUserFollowingsHandler(cxt) {
    try {
        const resultsFromES = await user_get_service_1.getUserFollowings(cxt.getUrlParam('id'), cxt.getRequestParams());
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getUserFollowingsHandler = getUserFollowingsHandler;
async function getUserFollowersHandler(cxt) {
    try {
        const resultsFromES = await user_get_service_1.getUserFollowers(cxt.getUrlParam('id'), cxt.getRequestParams());
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getUserFollowersHandler = getUserFollowersHandler;
async function getUserFriendsHandler(cxt) {
    try {
        const resultsFromES = await user_get_service_1.getUserFriends(cxt.getUrlParam('id'), cxt.getRequestParams());
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.getUserFriendsHandler = getUserFriendsHandler;
//# sourceMappingURL=user.handler.js.map