"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyInsightReviews = exports.getDailyInsightPublisherProfile = void 0;
const library_item_model_1 = require("../../../model/library-item/library-item.model");
// import logger from '../../../shared/logger';
const library_item_get_service_1 = require("../library-item.get.service");
// const log = logger(path.relative(process.cwd(), __filename));
async function getDailyInsightById(id) {
    return library_item_get_service_1.getLibraryItem(id, library_item_model_1.DAILY_INSIGHT_ITEM_SUMMARY_FIELDS);
}
exports.default = getDailyInsightById;
async function getDailyInsightPublisherProfile(id) {
    return library_item_get_service_1.getLibraryItemPublisherProfile(id);
}
exports.getDailyInsightPublisherProfile = getDailyInsightPublisherProfile;
async function getDailyInsightReviews(id, queryParams) {
    return library_item_get_service_1.getLibraryItemReviews(id, queryParams);
}
exports.getDailyInsightReviews = getDailyInsightReviews;
//# sourceMappingURL=daily-insight.get.service.js.map