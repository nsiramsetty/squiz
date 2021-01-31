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
exports.searchEvents = exports.getEventsSearchResultsFromES = exports.getEventSearchResultsFromFS = exports.getESQueryFoEventsTopViewSearch = exports.getESQueryForEventsRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const moment_1 = __importDefault(require("moment"));
const event_model_1 = require("../../model/event/event.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
// import logger from '../../shared/logger';
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
// const log = logger(path.relative(process.cwd(), __filename));
function getESQueryForEventsRegularSearch(keyword, offset, limit) {
    const fields = ['title', 'description', 'owner.name'];
    const epoch = moment_1.default.utc().add(moment_1.default.duration(0, 'minutes')).valueOf();
    const mainQuery = builder.boolQuery().must([
        builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'),
        builder.matchQuery('status.keyword', enum_1.EventStatus.APPROVED),
        builder.matchQuery('privacy.keyword', enum_1.EventPrivacy.PUBLIC),
        builder.matchQuery('type.keyword', enum_1.EventType.LIVE_STREAM),
        builder
            .boolQuery()
            .should([
            builder.boolQuery().must(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(epoch)),
            builder
                .boolQuery()
                .must([
                builder.rangeQuery('_next_occurrences.start_date.epoch').lte(epoch),
                builder.rangeQuery('_next_occurrences.end_date.epoch').gte(epoch),
            ]),
        ])
            .minimumShouldMatch(1),
    ]);
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
        builder.weightScoreFunction().filter(builder.matchQuery('title.keyword', keyword)).weight(50),
        builder.weightScoreFunction().filter(builder.multiMatchQuery(fields, keyword).fuzziness(0)).weight(20),
        builder.weightScoreFunction().filter(builder.multiMatchQuery(fields, keyword).fuzziness(1)).weight(10),
    ])
        .scoreMode('sum'))
        .source(event_model_1.EVENT_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForEventsRegularSearch = getESQueryForEventsRegularSearch;
function getESQueryFoEventsTopViewSearch(keyword, offset, limit) {
    const epoch = moment_1.default.utc().add(moment_1.default.duration(0, 'minutes')).valueOf();
    const fields = ['title', 'description', 'owner.name'];
    const mainQuery = builder.boolQuery().must([
        builder.multiMatchQuery(fields, keyword).fuzziness(1).type('best_fields'),
        builder.matchQuery('status.keyword', enum_1.EventStatus.APPROVED),
        builder.matchQuery('privacy.keyword', enum_1.EventPrivacy.PUBLIC),
        builder.matchQuery('type.keyword', enum_1.EventType.LIVE_STREAM),
        builder
            .boolQuery()
            .should([
            builder.boolQuery().must(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(epoch)),
            builder
                .boolQuery()
                .must([
                builder.rangeQuery('_next_occurrences.start_date.epoch').lte(epoch),
                builder.rangeQuery('_next_occurrences.end_date.epoch').gte(epoch),
            ]),
        ])
            .minimumShouldMatch(1),
    ]);
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
        builder.weightScoreFunction().filter(builder.termQuery('title.keyword', keyword)).weight(20),
        builder.weightScoreFunction().filter(builder.termQuery('title.keyword', keyword)).weight(10),
    ]))
        .source(event_model_1.EVENT_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryFoEventsTopViewSearch = getESQueryFoEventsTopViewSearch;
async function getEventSearchResultsFromFS(keyword, offset, limit) {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'title',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    const conditionsForSort = [];
    const fieldMasks = event_model_1.EVENT_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.EVENTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
exports.getEventSearchResultsFromFS = getEventSearchResultsFromFS;
async function getEventsSearchResultsFromES(keyword, offset, limit) {
    const esQuery = getESQueryForEventsRegularSearch(keyword, offset, limit);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.EVENT, esQuery);
}
exports.getEventsSearchResultsFromES = getEventsSearchResultsFromES;
async function searchEvents(queryParams) {
    var _a;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`searchEvents :: query :: is Required for Events Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    try {
        const resultsFromES = await getEventsSearchResultsFromES(keyword, offset, limit);
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        const resultsFromFS = await getEventSearchResultsFromFS(keyword, offset, limit);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
}
exports.searchEvents = searchEvents;
//# sourceMappingURL=event.search.service.js.map