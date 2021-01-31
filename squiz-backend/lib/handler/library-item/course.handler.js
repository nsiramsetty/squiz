"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseDaysHandler = exports.courseReviewsHandler = exports.coursePublisherProfileHandler = exports.courseGetByIDHandler = exports.courseFilterHandler = exports.courseSearchHandler = void 0;
const course_filter_service_1 = require("../../service/library-item/course/course.filter.service");
const course_get_service_1 = require("../../service/library-item/course/course.get.service");
const course_search_service_1 = require("../../service/library-item/course/course.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function courseSearchHandler(cxt) {
    try {
        return await course_search_service_1.searchCourses(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.courseSearchHandler = courseSearchHandler;
async function courseFilterHandler(cxt) {
    try {
        return await course_filter_service_1.filterCourses(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.courseFilterHandler = courseFilterHandler;
async function courseGetByIDHandler(cxt) {
    try {
        return await course_get_service_1.getCourse(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.courseGetByIDHandler = courseGetByIDHandler;
async function coursePublisherProfileHandler(cxt) {
    try {
        return await course_get_service_1.getCoursePublisherProfile(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.coursePublisherProfileHandler = coursePublisherProfileHandler;
async function courseReviewsHandler(cxt) {
    try {
        return await course_get_service_1.getCourseReviews(cxt.getUrlParam('id'), cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.courseReviewsHandler = courseReviewsHandler;
async function courseDaysHandler(cxt) {
    try {
        return await course_get_service_1.getCourseDays(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.courseDaysHandler = courseDaysHandler;
//# sourceMappingURL=course.handler.js.map