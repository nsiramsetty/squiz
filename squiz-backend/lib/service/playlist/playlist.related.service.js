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
exports.relatedPlaylists = exports.getRelatedPlaylistResultsFS = exports.getRelatedPlaylistResultsFromES = exports.getPubliherPlaylistFromESQuery = exports.getPopularPlaylistESQuery = exports.getRelatedPlaylistESQuery = void 0;
const builder = __importStar(require("elastic-builder"));
const playlist_model_1 = require("../../model/playlist/playlist.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
// import logger from '../../shared/logger';
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
const playlist_get_service_1 = __importDefault(require("./playlist.get.service"));
// const log = logger(path.relative(process.cwd(), __filename));
async function getRelatedPlaylistResultFromFS(conditionsForSearch, conditionsForSort, offset, limit) {
    const fieldMasks = playlist_model_1.PLAYLIST_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.PLAYLISTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
function getRelatedPlaylistESQuery(id, hashtags, offset, limit) {
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(playlist_model_1.PLAYLIST_SUMMARY_FIELDS);
    const queries = [];
    queries.push(builder.rangeQuery('number_of_library_items').gte(3));
    const mainQuery = builder.boolQuery().mustNot(builder.termQuery('id.keyword', id));
    queries.push(mainQuery);
    if (hashtags) {
        queries.push(builder
            .boolQuery()
            .must(hashtags.map((val) => builder.matchQuery('hashtags', val.toLowerCase()))));
    }
    reqBody.sort(builder.sort('number_of_followers', 'desc'));
    const finalBool = builder.boolQuery().must(queries);
    return reqBody.query(finalBool);
}
exports.getRelatedPlaylistESQuery = getRelatedPlaylistESQuery;
function getPopularPlaylistESQuery(id, offset, limit) {
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(playlist_model_1.PLAYLIST_SUMMARY_FIELDS);
    reqBody.sort(builder.sort('number_of_followers', 'desc'));
    const finalBool = builder.boolQuery().must(builder.boolQuery().mustNot(builder.termQuery('id.keyword', id)));
    return reqBody.query(finalBool);
}
exports.getPopularPlaylistESQuery = getPopularPlaylistESQuery;
function getPubliherPlaylistFromESQuery(offset, limit) {
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(playlist_model_1.PLAYLIST_SUMMARY_FIELDS);
    const queries = [];
    queries.push();
    const mainQuery = builder.boolQuery().must(builder.termQuery('owner.is_publisher', true));
    queries.push(mainQuery);
    reqBody.sort(builder.sort('number_of_followers', 'desc'));
    const finalBool = builder.boolQuery().must(queries);
    return reqBody.query(finalBool);
}
exports.getPubliherPlaylistFromESQuery = getPubliherPlaylistFromESQuery;
async function getRelatedPlaylistResultsFromES(playlistId, queryParams) {
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const playlist = (await playlist_get_service_1.default(playlistId));
    const { id, hashtags } = playlist;
    if (hashtags && hashtags.length) {
        let esQuery = getRelatedPlaylistESQuery(id, hashtags, offset, limit);
        let esResult = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.PLAYLIST, esQuery);
        const { items } = esResult;
        if (items.length < limit) {
            // Note : if related playlist is less than limit then we are concatinating playlist of popular publisher
            const newLimit = limit - esResult.items.length;
            esQuery = getPubliherPlaylistFromESQuery(0, newLimit);
            esResult = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.PLAYLIST, esQuery);
            return Promise.resolve({ total: limit, items: [...items, ...esResult.items] });
        }
        return Promise.resolve(esResult);
    }
    const esQuery = getPopularPlaylistESQuery(id, 0, limit);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.PLAYLIST, esQuery);
}
exports.getRelatedPlaylistResultsFromES = getRelatedPlaylistResultsFromES;
async function getRelatedPlaylistResultsFS(playlistId, offset, limit) {
    let conditionsForSearch = [];
    const playlist = (await playlist_get_service_1.default(playlistId));
    const { hashtags } = playlist;
    if (hashtags && hashtags.length > 0) {
        let conditionsForSort = new Array();
        conditionsForSort.push({ fieldPath: 'number_of_followers', directionStr: 'desc' });
        conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'hashtags',
            opStr: enum_1.FSWhereOperator.ARRAY_CONTAINS_ANY,
            value: hashtags,
        });
        const fsResponse = await getRelatedPlaylistResultFromFS(conditionsForSearch, conditionsForSort, offset, limit);
        let { items } = fsResponse;
        items = items.filter((e) => {
            const element = e;
            return !!(element.number_of_library_items && element.number_of_library_items > 2) && element.id !== playlistId;
        });
        if (items.length < limit) {
            conditionsForSort = new Array();
            conditionsForSort.push({ fieldPath: 'owner.number_of_followers', directionStr: 'desc' });
            conditionsForSearch = [];
            conditionsForSearch.push({
                fieldPath: 'owner.is_publisher',
                opStr: enum_1.FSWhereOperator.EQUAL_TO,
                value: true,
            });
            const res = await getRelatedPlaylistResultFromFS(conditionsForSearch, conditionsForSort, offset, limit - items.length);
            items.concat(res.items);
            return Promise.resolve({ total: items.length, items });
        }
        return Promise.resolve({ total: items.length, items });
    }
    return Promise.resolve({ total: 0, items: [] });
}
exports.getRelatedPlaylistResultsFS = getRelatedPlaylistResultsFS;
async function relatedPlaylists(playlistId, queryParams) {
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const resultsFromES = await getRelatedPlaylistResultsFromES(playlistId, queryParams);
    if (resultsFromES.total === 0) {
        const resultsFromFS = await getRelatedPlaylistResultsFS(playlistId, offset, limit);
        return { total: resultsFromFS.total, items: transform_service_1.default(resultsFromFS.items) };
    }
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.relatedPlaylists = relatedPlaylists;
//# sourceMappingURL=playlist.related.service.js.map