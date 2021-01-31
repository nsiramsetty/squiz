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
exports.searchHashtags = exports.getHashtagSearchResultsFromES = exports.getHashtagSearchResultsFromFS = exports.getESQueryForHashtagsTopViewSearch = exports.getESQueryForHashtagsRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const hashtag_model_1 = require("../../model/hashtag/hashtag.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
// import logger from '../../shared/logger';
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
// const log = logger(path.relative(process.cwd(), __filename));
function getESQueryForHashtagsRegularSearch(keyword, offset, limit) {
    const fields = ['topic', 'name', 'short_description', 'long_description'];
    const mainQuery = builder.boolQuery().must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'));
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(0).type('best_fields'))
            .weight(20),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('best_fields'))
            .weight(10),
    ]))
        .source(hashtag_model_1.HASHTAG_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForHashtagsRegularSearch = getESQueryForHashtagsRegularSearch;
function getESQueryForHashtagsTopViewSearch(keyword, offset, limit, deviceLang) {
    const searchFields = ['name^4', 'short_description', 'long_description'];
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(builder.multiMatchQuery(searchFields, keyword).fuzziness(2)))
        .functions([
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 7 : 23),
        builder
            .weightScoreFunction()
            .filter(builder
            .boolQuery()
            .should(builder.termQuery('topic.keyword', keyword.toLowerCase()))
            .should(builder.termQuery('name.keyword', keyword)))
            .weight(40),
    ])
        .boostMode('sum')
        .scoreMode('sum'))
        .source(hashtag_model_1.HASHTAG_SUMMARY_TOP_VIEW_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForHashtagsTopViewSearch = getESQueryForHashtagsTopViewSearch;
async function getHashtagSearchResultsFromFS(keyword, offset, limit) {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'name',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    const conditionsForSort = [];
    const fieldMasks = hashtag_model_1.HASHTAG_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.HASHTAGS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
exports.getHashtagSearchResultsFromFS = getHashtagSearchResultsFromFS;
async function getHashtagSearchResultsFromES(keyword, offset, limit) {
    const esQuery = getESQueryForHashtagsRegularSearch(keyword, offset, limit);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.HASHTAG, esQuery);
}
exports.getHashtagSearchResultsFromES = getHashtagSearchResultsFromES;
async function searchHashtags(queryParams) {
    var _a;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`searchHashtags :: query :: is Required for Topics Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const resultsFromES = await getHashtagSearchResultsFromES(keyword, offset, limit);
    if (resultsFromES.total === 0) {
        const resultsFromFS = await getHashtagSearchResultsFromFS(keyword, offset, limit);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.searchHashtags = searchHashtags;
//# sourceMappingURL=hashtag.search.service.js.map