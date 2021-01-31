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
exports.searchAudio = exports.getAudioSearchResultsFromFS = exports.getAudioSearchResultsFromES = exports.getESQueryForAudioTopViewSearch = exports.getESQueryForAudioSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const library_item_model_1 = require("../../model/library-item/library-item.model");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
const logger_1 = __importDefault(require("../../shared/logger"));
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const categorization_service_1 = __importDefault(require("../shared/categorization.service"));
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const i18n_service_1 = require("../shared/i18n.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
const DEFAULT_PAGE_SIZE = 20;
function getESQueryForAudioSearch(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams) {
    const matchFields = [
        'title^3',
        'learn_description',
        'content_type',
        'publisher.name^2',
        'long_description',
        'short_description',
    ];
    const weightFields = ['title^3', 'short_description'];
    const mainQuery = builder
        .boolQuery()
        .must(builder.multiMatchQuery(matchFields, keyword).fuzziness(2).type('most_fields'));
    if (singleTrackOnly) {
        mainQuery.must(builder.termQuery('item_type.keyword', enum_1.ItemType.SINGLE_TRACKS));
    }
    const contextFilterQueries = categorization_service_1.default(queryParams);
    for (let i = 0; i < contextFilterQueries.length; i += 1) {
        mainQuery.should(contextFilterQueries[i]);
    }
    if (contextFilterQueries.length > 0) {
        mainQuery.minimumShouldMatch(1);
    }
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 20 : 30),
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('item_type.keyword', enum_1.ItemType.DAILY_INSIGHT))
            .weight(10),
        builder.weightScoreFunction().filter(builder.termQuery('item_type.keyword', enum_1.ItemType.COURSES)).weight(20),
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('item_type.keyword', enum_1.ItemType.SINGLE_TRACKS))
            .weight(30),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(2).type('most_fields'))
            .weight(10),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(1).type('most_fields'))
            .weight(20),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(0).type('most_fields'))
            .weight(30),
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('title.lowercase_keyword', keyword.toLowerCase()))
            .weight(50),
        builder.scriptScoreFunction(builder.script('inline', `_score * doc['play_count'].value / 7000000`)),
    ])
        .boostMode('sum')
        .scoreMode('sum'))
        .source([...library_item_model_1.COURSE_SUMMARY_FIELDS, ...library_item_model_1.DAILY_INSIGHT_ITEM_SUMMARY_FIELDS, ...library_item_model_1.SINGLE_TRACK_SUMMARY_FIELDS])
        .from(offset)
        .size(limit);
}
exports.getESQueryForAudioSearch = getESQueryForAudioSearch;
function getESQueryForAudioTopViewSearch(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams) {
    const matchFields = [
        'title^2',
        'learn_description',
        'content_type',
        'publisher.name^2',
        'long_description',
        'short_description',
    ];
    const weightFields = ['title^3', 'short_description'];
    const mainQuery = builder
        .boolQuery()
        .must(builder.multiMatchQuery(matchFields, keyword).fuzziness(2).type('most_fields'))
        .mustNot(builder.termQuery('item_type.keyword', enum_1.ItemType.DAILY_INSIGHT));
    if (singleTrackOnly) {
        mainQuery.mustNot(builder.termQuery('item_type.keyword', enum_1.ItemType.COURSES));
    }
    const contextFilterQueries = categorization_service_1.default(queryParams);
    for (let i = 0; i < contextFilterQueries.length; i += 1) {
        mainQuery.should(contextFilterQueries[i]);
    }
    if (contextFilterQueries.length > 0) {
        mainQuery.minimumShouldMatch(1);
    }
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 20 : 30),
        builder.weightScoreFunction().filter(builder.termQuery('item_type.keyword', enum_1.ItemType.COURSES)).weight(20),
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('item_type.keyword', enum_1.ItemType.SINGLE_TRACKS))
            .weight(30),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(2).type('most_fields'))
            .weight(10),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(matchFields, keyword).fuzziness(1).type('most_fields'))
            .weight(20),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(matchFields, keyword).fuzziness(0).type('most_fields'))
            .weight(30),
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('title.lowercase_keyword', keyword.toLowerCase()))
            .weight(50),
        builder.scriptScoreFunction(builder.script('inline', `_score * doc['play_count'].value / 7000000`)),
    ])
        .boostMode('sum')
        .scoreMode('sum'))
        .source(library_item_model_1.LIBRARY_ITEM_SUMMARY_TOP_VIEW_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForAudioTopViewSearch = getESQueryForAudioTopViewSearch;
function transformResponse(response) {
    const filteredRecords = [];
    response.items.forEach((item) => {
        if (item.item_type === enum_1.ItemType.COURSES) {
            filteredRecords.push(Object.assign(Object.assign({}, lodash_1.default.pick(item, library_item_model_1.COURSE_SUMMARY_FIELDS)), { search_result_type: item.search_result_type }));
        }
        else if (item.item_type === enum_1.ItemType.DAILY_INSIGHT) {
            filteredRecords.push(Object.assign(Object.assign({}, lodash_1.default.pick(item, library_item_model_1.DAILY_INSIGHT_ITEM_SUMMARY_FIELDS)), { search_result_type: item.search_result_type }));
        }
        else {
            filteredRecords.push(Object.assign(Object.assign({}, lodash_1.default.pick(item, library_item_model_1.SINGLE_TRACK_SUMMARY_FIELDS)), { search_result_type: item.search_result_type }));
        }
    });
    return filteredRecords;
}
async function getAudioSearchResultsFromES(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams) {
    const esQuery = getESQueryForAudioSearch(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams);
    const response = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.LIBRARY_ITEM, esQuery);
    return { total: response.total, items: transformResponse(response) };
}
exports.getAudioSearchResultsFromES = getAudioSearchResultsFromES;
async function getAudioSearchResultsFromFS(keyword, offset, limit) {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'title',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    const conditionsForSort = [];
    const fieldMasks = library_item_model_1.LIBRARY_ITEM_SUMMARY_FIELDS;
    const response = await firestore_service_1.getFirestoreDocuments(enum_1.Collection.LIBRARY_ITEMS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
    return { total: response.total, items: transformResponse(response) };
}
exports.getAudioSearchResultsFromFS = getAudioSearchResultsFromFS;
async function searchAudio(queryParams) {
    var _a, _b;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`SearchAudio :: query :: is Required for Audio Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
    const deviceLang = i18n_service_1.validateAndReplaceWithEnglish([(_b = queryParams.device_lang) === null || _b === void 0 ? void 0 : _b.toString().trim()])[0];
    const singleTrackOnly = query_parameter_parser_1.booleanOrDefault(queryParams.single_tracks_only, false);
    try {
        const resultsFromES = await getAudioSearchResultsFromES(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams);
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        log.error(`SearchAudio:: ${error}`);
        const resultsFromFS = await getAudioSearchResultsFromFS(keyword, offset, limit);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
}
exports.searchAudio = searchAudio;
//# sourceMappingURL=audio.search.service.js.map