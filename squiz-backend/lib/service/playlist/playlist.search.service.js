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
exports.searchPlaylists = exports.getPlaylistSearchResultsFromES = exports.getPlaylistSearchResultsFromFS = exports.getESQueryForPlaylistTopViewSearch = exports.getPlaylistESQueryForRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const moment_1 = __importDefault(require("moment"));
const playlist_model_1 = require("../../model/playlist/playlist.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
// import logger from '../../shared/logger';
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
// const log = logger(path.relative(process.cwd(), __filename));
function getPlaylistESQueryForRegularSearch(keyword, offset, limit) {
    const epoch = moment_1.default.utc().subtract(moment_1.default.duration(5, 'minutes')).valueOf();
    const fields = ['title^2.8', 'owner.name'];
    const mainQuery = builder
        .boolQuery()
        .must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'))
        .must(builder.termQuery('is_private', false))
        .must(builder.rangeQuery('created_at.epoch').lte(epoch))
        .must(builder.rangeQuery('number_of_library_items').gt(2));
    return builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(mainQuery))
        .source(playlist_model_1.PLAYLIST_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getPlaylistESQueryForRegularSearch = getPlaylistESQueryForRegularSearch;
function getESQueryForPlaylistTopViewSearch(keyword, offset, limit, deviceLang) {
    const fields = ['description', 'hashtags', 'owner.name^4', 'title^4'];
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('most_fields')))
        .functions([
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 7 : 23),
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('title.lowercase_keyword', keyword.toLowerCase()))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 20 : 17),
    ])
        .boostMode('sum')
        .scoreMode('sum'))
        .source(playlist_model_1.PLAYLIST_SUMMARY_TOP_VIEW_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForPlaylistTopViewSearch = getESQueryForPlaylistTopViewSearch;
async function getPlaylistSearchResultsFromFS(keyword, offset, limit) {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'title',
        opStr: '==',
        value: keyword,
    });
    const conditionsForSort = [];
    const fieldMasks = playlist_model_1.PLAYLIST_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.PLAYLISTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
exports.getPlaylistSearchResultsFromFS = getPlaylistSearchResultsFromFS;
async function getPlaylistSearchResultsFromES(keyword, offset, limit) {
    const esQuery = getPlaylistESQueryForRegularSearch(keyword, offset, limit);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.PLAYLIST, esQuery);
}
exports.getPlaylistSearchResultsFromES = getPlaylistSearchResultsFromES;
async function searchPlaylists(queryParams) {
    var _a;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`SearchPlayLists :: Query String ::  query :: is Required for Playlist Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const resultsFromES = await getPlaylistSearchResultsFromES(keyword, offset, limit);
    if (resultsFromES.total === 0) {
        const resultsFromFS = await getPlaylistSearchResultsFromFS(keyword, offset, limit);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.searchPlaylists = searchPlaylists;
//# sourceMappingURL=playlist.search.service.js.map