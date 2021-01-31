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
exports.getPublisherLiveEvents = exports.getPublisherGratitudeWall = exports.getPublisherLibraryItems = exports.getPublisherDailyInsights = exports.getPublisherPlaylists = exports.getPublisherCourses = exports.getPublisher = void 0;
const builder = __importStar(require("elastic-builder"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const axios_helper_1 = require("../../../helper/axios.helper");
const event_model_1 = require("../../../model/event/event.model");
const library_item_model_1 = require("../../../model/library-item/library-item.model");
const playlist_model_1 = require("../../../model/playlist/playlist.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
// import logger from '../../../shared/logger';
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const single_track_filter_service_1 = require("../../library-item/single-track/single-track.filter.service");
const elastic_service_1 = require("../../shared/elastic.service");
const firestore_service_1 = require("../../shared/firestore.service");
// const log = logger(path.relative(process.cwd(), __filename));
async function getPublisher(id) {
    return elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.USER, axios_helper_1.ESDefaultClient).catch(async () => {
        return firestore_service_1.getFirestoreDocById(enum_1.Collection.USERS, id);
    });
}
exports.getPublisher = getPublisher;
async function getPublisherCourses(id) {
    const queries = [];
    const reqBody = builder
        .requestBodySearch()
        .from(0)
        .size(constants_1.DEFAULT_PAGE_SIZE)
        .source(library_item_model_1.COURSE_SUMMARY_FIELDS);
    reqBody.sort(builder.sort('created_at.epoch', 'desc'));
    reqBody.sort(builder.sort('number_of_students', 'desc'));
    queries.push(builder.boolQuery().must(builder.matchQuery('publisher.id', id)));
    queries.push(builder.boolQuery().must(builder.matchQuery('item_type', 'COURSES')));
    const esQuery = reqBody.query(builder.boolQuery().must(queries));
    const resultsFromES = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.LIBRARY_ITEM, esQuery);
    if (resultsFromES.total === 0) {
        const conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'item_type',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: 'COURSES',
        });
        conditionsForSearch.push({
            fieldPath: 'publisher.id',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: id,
        });
        const conditionsForSort = [];
        conditionsForSort.push({
            fieldPath: 'created_at',
            directionStr: 'desc',
        });
        conditionsForSort.push({
            fieldPath: 'number_of_students',
            directionStr: 'desc',
        });
        const fieldMasks = library_item_model_1.COURSE_SUMMARY_FIELDS;
        const offset = 0;
        const limit = constants_1.DEFAULT_PAGE_SIZE;
        const resultsFromFS = await firestore_service_1.getFirestoreDocuments(enum_1.Collection.LIBRARY_ITEMS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
        return { total: resultsFromFS.total, items: resultsFromFS.items };
    }
    return { total: resultsFromES.total, items: resultsFromES.items };
}
exports.getPublisherCourses = getPublisherCourses;
async function getPublisherPlaylists(id, queryParams) {
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const epoch = moment_1.default.utc().subtract(moment_1.default.duration(5, 'minutes')).valueOf();
    const queries = [];
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(playlist_model_1.PLAYLIST_SUMMARY_FIELDS);
    reqBody.sort(builder.sort('created_at.epoch', 'desc'));
    queries.push(builder.boolQuery().must(builder.rangeQuery('created_at.epoch').lte(epoch)));
    queries.push(builder.boolQuery().must(builder.matchQuery('is_private', 'false')));
    queries.push(builder.boolQuery().must(builder.matchQuery('owner.id', id)));
    const esQuery = reqBody.query(builder.boolQuery().must(queries));
    const resultsFromES = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.PLAYLIST, esQuery);
    if (resultsFromES.total === 0) {
        const conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'is_private',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: false,
        });
        conditionsForSearch.push({
            fieldPath: 'created_at.epoch',
            opStr: enum_1.FSWhereOperator.LESS_THAN_EQUAL_TO,
            value: epoch,
        });
        const conditionsForSort = [];
        conditionsForSort.push({
            fieldPath: 'created_at.epoch',
            directionStr: 'desc',
        });
        const fieldMasks = playlist_model_1.PLAYLIST_SUMMARY_FIELDS;
        const resultsFromFS = await firestore_service_1.getFirestoreDocuments(`${enum_1.Collection.USERS}/${id}/owned_playlists`, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
        return { total: resultsFromFS.total, items: resultsFromFS.items };
    }
    return { total: resultsFromES.total, items: resultsFromES.items };
}
exports.getPublisherPlaylists = getPublisherPlaylists;
async function getPublisherDailyInsights(id) {
    const tomorrow = moment_1.default.utc().add(1, 'days').format('YYYY-MM-DD');
    const queries = [];
    const reqBody = builder
        .requestBodySearch()
        .from(0)
        .size(constants_1.DEFAULT_PAGE_SIZE)
        .source(library_item_model_1.DAILY_INSIGHT_ITEM_SUMMARY_FIELDS);
    reqBody.sort(builder.sort('calendar_id', 'desc'));
    queries.push(builder.boolQuery().must(builder.matchQuery('publisher.id', id)));
    queries.push(builder.boolQuery().must(builder.matchQuery('item_type', 'DAILY_INSIGHT')));
    queries.push(builder.boolQuery().must(builder.rangeQuery('calendar_id').lte(tomorrow)));
    const esQuery = reqBody.query(builder.boolQuery().must(queries));
    const resultsFromES = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.LIBRARY_ITEM, esQuery);
    if (resultsFromES.total === 0) {
        const conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'item_type',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: 'DAILY_INSIGHT',
        });
        conditionsForSearch.push({
            fieldPath: 'publisher.id',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: id,
        });
        conditionsForSearch.push({
            fieldPath: 'calendar_id',
            opStr: enum_1.FSWhereOperator.LESS_THAN_EQUAL_TO,
            value: tomorrow,
        });
        const conditionsForSort = [];
        conditionsForSort.push({
            fieldPath: 'calendar_id',
            directionStr: 'desc',
        });
        const fieldMasks = library_item_model_1.DAILY_INSIGHT_ITEM_SUMMARY_FIELDS;
        const offset = 0;
        const limit = constants_1.DEFAULT_PAGE_SIZE;
        const resultsFromFS = await firestore_service_1.getFirestoreDocuments(enum_1.Collection.LIBRARY_ITEMS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
        return { total: resultsFromFS.total, items: resultsFromFS.items };
    }
    return { total: resultsFromES.total, items: resultsFromES.items };
}
exports.getPublisherDailyInsights = getPublisherDailyInsights;
async function getPublisherLibraryItems(id, queryParams) {
    Object.assign(queryParams, { publisher_id: id });
    const esQuery = single_track_filter_service_1.getSingleTrackESQueryForRegularFilter(queryParams);
    const resultsFromES = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.LIBRARY_ITEM, esQuery);
    if (resultsFromES.total === 0) {
        const conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'item_type',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: 'SINGLE_TRACKS',
        });
        conditionsForSearch.push({
            fieldPath: 'content_type',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: 'GUIDED',
        });
        conditionsForSearch.push({
            fieldPath: 'publisher.id',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: id,
        });
        const conditionsForSort = [];
        conditionsForSort.push({
            fieldPath: 'play_count',
            directionStr: 'desc',
        });
        const fieldMasks = library_item_model_1.LIBRARY_ITEM_SUMMARY_FIELDS;
        const offset = 0;
        const limit = constants_1.DEFAULT_PAGE_SIZE;
        const resultsFromFS = await firestore_service_1.getFirestoreDocuments(enum_1.Collection.LIBRARY_ITEMS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
        return { total: resultsFromFS.total, items: resultsFromFS.items };
    }
    return { total: resultsFromES.total, items: resultsFromES.items };
}
exports.getPublisherLibraryItems = getPublisherLibraryItems;
async function getPublisherGratitudeWall(id) {
    const conditionsForSearch = [];
    const conditionsForSort = [];
    conditionsForSort.push({
        fieldPath: 'created_at.epoch',
        directionStr: 'desc',
    });
    const fieldMasks = ['author'];
    const offset = 0;
    const limit = 20;
    return firestore_service_1.getFirestoreDocuments(`${enum_1.Collection.USERS}/${id}/private/gratitude_wall_comments/posts`, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks, enum_1.SearchResultType.GRATITUDE_WALL_POSTS).then((fsSearchTransformResponse) => {
        const items = fsSearchTransformResponse.items
            .filter((doc) => {
            const document = doc;
            return !!(document.author &&
                document.author.avatar &&
                (document.author.avatar.medium || document.author.avatar.small));
        })
            .filter((doc) => {
            var _a;
            const document = doc;
            return ((_a = document.author) === null || _a === void 0 ? void 0 : _a.id) !== id;
        })
            .map((doc) => {
            return Object.assign(doc, { id: doc.id });
        });
        return { total: items.length, items: items.splice(0, 20) };
    });
}
exports.getPublisherGratitudeWall = getPublisherGratitudeWall;
async function getPublisherLiveEvents(id) {
    const queries = [];
    const reqBody = builder.requestBodySearch().from(0).size(20).source(event_model_1.EVENT_SUMMARY_FIELDS);
    const epoch = moment_1.default.utc().add(moment_1.default.duration(0, 'minutes')).valueOf();
    reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', 'asc'));
    queries.push(builder.boolQuery().must(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(epoch)));
    queries.push(builder.boolQuery().must(builder.matchQuery('owner.id', id)));
    const esQuery = reqBody.query(builder.boolQuery().must(queries));
    const resultsFromES = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.EVENT, esQuery);
    const resultsFromESItems = resultsFromES.items;
    resultsFromESItems.forEach((item) => {
        var _a;
        const nextOccurrences = (_a = item._next_occurrences) === null || _a === void 0 ? void 0 : _a.map((x) => {
            const occurrence = lodash_1.default.pick(x, event_model_1.OCCURRENCE_SUMMARY_FIELDS);
            return occurrence;
        });
        Object.assign(item, { _next_occurrences: nextOccurrences });
    });
    return {
        total: resultsFromES.total,
        items: resultsFromES.items,
    };
}
exports.getPublisherLiveEvents = getPublisherLiveEvents;
//# sourceMappingURL=publisher.get.service.js.map