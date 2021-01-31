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
exports.searchSingleTracks = exports.getSingleTrackSearchResultsFromES = exports.getSingleTrackSearchResultsFromFS = exports.getESQueryForSingleTracksRegularSearch = exports.libraryItemQueryForTopView = void 0;
const builder = __importStar(require("elastic-builder"));
const path_1 = __importDefault(require("path"));
const library_item_model_1 = require("../../../model/library-item/library-item.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
const http_400_error_1 = __importDefault(require("../../../shared/http/http-400-error"));
const logger_1 = __importDefault(require("../../../shared/logger"));
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const categorization_service_1 = __importDefault(require("../../shared/categorization.service"));
const elastic_service_1 = require("../../shared/elastic.service");
const firestore_service_1 = require("../../shared/firestore.service");
const transform_service_1 = __importDefault(require("../../shared/transform.service"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function libraryItemQueryForTopView(deviceLang, keyword, offset, limit, queryParams) {
    const fields = ['title^2', 'content_type', 'publisher.name', 'long_description', 'short_description'];
    const boolQuery = builder
        .boolQuery()
        .must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('most_fields'))
        .must(builder.termQuery('item_type.keyword', enum_1.ItemType.SINGLE_TRACKS));
    const contextFilterQueries = categorization_service_1.default(queryParams);
    for (let i = 0; i < contextFilterQueries.length; i += 1) {
        boolQuery.should(contextFilterQueries[i]);
    }
    if (contextFilterQueries.length > 0) {
        boolQuery.minimumShouldMatch(1);
    }
    const scoreFunctions = [
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 10 : 20),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(0).type('most_fields'))
            .weight(20),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('most_fields'))
            .weight(5),
        builder.scriptScoreFunction(builder.script('inline', `_score * doc['play_count'].value / 7000000`)),
    ];
    return builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(boolQuery).functions(scoreFunctions).boostMode('sum').scoreMode('sum'))
        .source(library_item_model_1.SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS)
        .from(offset)
        .size(limit);
}
exports.libraryItemQueryForTopView = libraryItemQueryForTopView;
function getESQueryForSingleTracksRegularSearch(keyword, offset, limit, deviceLang, queryParams) {
    const fields = ['title^2', 'short_description', 'long_description', 'publisher.name'];
    const mainQuery = builder.boolQuery().must(builder.termQuery('item_type.keyword', enum_1.ItemType.SINGLE_TRACKS));
    if (keyword.indexOf(' ') >= 0) {
        mainQuery.must(builder.multiMatchQuery(fields, keyword).type('best_fields'));
    }
    else {
        mainQuery.must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'));
    }
    const contextFilterQueries = categorization_service_1.default(queryParams);
    contextFilterQueries.forEach((contextFilterQuery) => {
        mainQuery.should(contextFilterQuery);
    });
    if (contextFilterQueries.length > 0) {
        mainQuery.minimumShouldMatch(1);
    }
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(mainQuery)
        .function(builder.weightScoreFunction().filter(builder.termQuery('lang.iso_639_1', deviceLang)).weight(2))
        .function(builder.fieldValueFactorFunction().field('play_count').factor(0.1).modifier('log1p').missing(1)))
        .source(library_item_model_1.SINGLE_TRACK_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForSingleTracksRegularSearch = getESQueryForSingleTracksRegularSearch;
async function getSingleTrackSearchResultsFromFS(keyword, offset, limit) {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'item_type',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: 'SINGLE_TRACKS',
    });
    conditionsForSearch.push({
        fieldPath: 'title',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    const conditionsForSort = [];
    const fieldMasks = library_item_model_1.SINGLE_TRACK_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.LIBRARY_ITEMS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks, undefined, true);
}
exports.getSingleTrackSearchResultsFromFS = getSingleTrackSearchResultsFromFS;
async function getSingleTrackSearchResultsFromES(keyword, offset, limit, deviceLang, queryParams) {
    const esQuery = getESQueryForSingleTracksRegularSearch(keyword, offset, limit, deviceLang, queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.LIBRARY_ITEM, esQuery, true);
}
exports.getSingleTrackSearchResultsFromES = getSingleTrackSearchResultsFromES;
async function searchSingleTracks(queryParams) {
    var _a, _b;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`SearchSingleTracks :: query :: is Required for Library Items Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const deviceLang = (_b = queryParams.device_lang) === null || _b === void 0 ? void 0 : _b.toString().trim();
    if (!deviceLang) {
        throw new http_400_error_1.default(`SearchSingleTracks :: device_lang :: is Required for Library Items Search.`);
    }
    try {
        const resultsFromES = await getSingleTrackSearchResultsFromES(keyword, offset, limit, deviceLang, queryParams);
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        log.error(error);
        const resultsFromFS = await getSingleTrackSearchResultsFromFS(keyword, offset, limit);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
}
exports.searchSingleTracks = searchSingleTracks;
//# sourceMappingURL=single-track.search.service.js.map