"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleTrackPublisherProfile = exports.getSingleTrackReviews = void 0;
const library_item_model_1 = require("../../../model/library-item/library-item.model");
// import logger from '../../../shared/logger';
const library_item_get_service_1 = require("../library-item.get.service");
// const log = logger(path.relative(process.cwd(), __filename));
async function getSingleTrack(id) {
    return library_item_get_service_1.getLibraryItem(id, library_item_model_1.SINGLE_TRACK_SUMMARY_FIELDS);
}
exports.default = getSingleTrack;
async function getSingleTrackReviews(id, queryParams) {
    return library_item_get_service_1.getLibraryItemReviews(id, queryParams);
}
exports.getSingleTrackReviews = getSingleTrackReviews;
async function getSingleTrackPublisherProfile(id) {
    return library_item_get_service_1.getLibraryItemPublisherProfile(id);
}
exports.getSingleTrackPublisherProfile = getSingleTrackPublisherProfile;
//# sourceMappingURL=single-track.get.service.js.map