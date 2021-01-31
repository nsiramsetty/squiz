"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLibraryItemPublisherProfile = exports.getLibraryItemReviews = exports.getLibraryItem = void 0;
const axios_helper_1 = require("../../helper/axios.helper");
const library_item_model_1 = require("../../model/library-item/library-item.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
// import logger from '../../shared/logger';
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const publisher_get_service_1 = require("../user/publisher/publisher.get.service");
// const log = logger(path.relative(process.cwd(), __filename));
async function getLibraryItem(id, summaryFields) {
    return elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.LIBRARY_ITEM, axios_helper_1.ESDefaultClient, summaryFields).catch(async () => {
        return firestore_service_1.getFirestoreDocById(enum_1.Collection.LIBRARY_ITEMS, id, summaryFields);
    });
}
exports.getLibraryItem = getLibraryItem;
async function getLibraryItemReviews(id, queryParams) {
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const libraryItem = await getLibraryItem(id);
    const conditionsForSearch = [];
    const conditionsForSort = [];
    const fieldMasks = library_item_model_1.LIBRARY_ITEM_REVIEW_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(`${enum_1.Collection.LIBRARY_ITEMS}/${libraryItem.id}/reviews`, conditionsForSearch, conditionsForSort, offset || 0, limit || 20, fieldMasks, enum_1.SearchResultType.LIBRARY_ITEM_REVIEWS);
}
exports.getLibraryItemReviews = getLibraryItemReviews;
async function getLibraryItemPublisherProfile(id) {
    const libraryItem = (await getLibraryItem(id));
    return publisher_get_service_1.getPublisher(libraryItem.publisher.id);
}
exports.getLibraryItemPublisherProfile = getLibraryItemPublisherProfile;
//# sourceMappingURL=library-item.get.service.js.map