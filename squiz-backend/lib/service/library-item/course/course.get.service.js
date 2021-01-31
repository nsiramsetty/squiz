"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseDays = exports.getCourseReviews = exports.getCoursePublisherProfile = exports.getCourse = void 0;
const library_item_model_1 = require("../../../model/library-item/library-item.model");
const enum_1 = require("../../../shared/enum");
// import logger from '../../../shared/logger';
const firestore_service_1 = require("../../shared/firestore.service");
const library_item_get_service_1 = require("../library-item.get.service");
// const log = logger(path.relative(process.cwd(), __filename));
async function getCourse(id) {
    return library_item_get_service_1.getLibraryItem(id, library_item_model_1.COURSE_SUMMARY_FIELDS);
}
exports.getCourse = getCourse;
async function getCoursePublisherProfile(id) {
    return library_item_get_service_1.getLibraryItemPublisherProfile(id);
}
exports.getCoursePublisherProfile = getCoursePublisherProfile;
async function getCourseReviews(id, queryParams) {
    return library_item_get_service_1.getLibraryItemReviews(id, queryParams);
}
exports.getCourseReviews = getCourseReviews;
async function getCourseDays(id) {
    const course = await library_item_get_service_1.getLibraryItem(id, library_item_model_1.COURSE_SUMMARY_FIELDS);
    const conditionsForSearch = [];
    const conditionsForSort = [];
    const offset = 0;
    const limit = 20;
    const fieldMasks = library_item_model_1.COURSE_DAY_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(`${enum_1.Collection.LIBRARY_ITEMS}/${course.id}/course_days`, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks, enum_1.SearchResultType.COURSE_DAYS);
}
exports.getCourseDays = getCourseDays;
//# sourceMappingURL=course.get.service.js.map