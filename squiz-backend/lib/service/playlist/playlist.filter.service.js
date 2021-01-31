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
exports.filterPlaylists = exports.getPlaylistFilterResultsFromES = exports.getPlaylistESQueryForRegularFilter = void 0;
const builder = __importStar(require("elastic-builder"));
const playlist_model_1 = require("../../model/playlist/playlist.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
// import logger from '../../shared/logger';
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
// const log = logger(path.relative(process.cwd(), __filename));
function getPlaylistESQueryForRegularFilter(queryParams) {
    var _a, _b, _c, _d, _e;
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const hashtags = (_b = queryParams.hashtags) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const sort_option = (_c = queryParams.sort_option) === null || _c === void 0 ? void 0 : _c.toString().trim();
    const sortDirection = (_d = queryParams.sort_direction) === null || _d === void 0 ? void 0 : _d.toString().trim();
    const includeDescription = query_parameter_parser_1.booleanOrDefault(queryParams.include_description, false);
    const region_name = (_e = queryParams.region_name) === null || _e === void 0 ? void 0 : _e.toString().trim();
    const source = playlist_model_1.PLAYLIST_SUMMARY_FIELDS;
    const queries = [];
    if (includeDescription) {
        source.push('description');
    }
    const reqBody = builder.requestBodySearch().from(offset).size(limit).source(source);
    queries.push(builder.rangeQuery('number_of_library_items').gte(3));
    const matchQuery = keyword ? builder.matchQuery('title', keyword) : builder.matchAllQuery();
    queries.push(builder.boolQuery().must(matchQuery));
    if (hashtags) {
        queries.push(builder
            .boolQuery()
            .must(hashtags.split(',').map((val) => builder.matchQuery('hashtags', val.toLowerCase()))));
    }
    if (region_name) {
        queries.push(builder.boolQuery().must(builder.matchQuery('owner.region.name', region_name.toLowerCase())));
    }
    if (sort_option) {
        switch (sort_option.toLowerCase()) {
            case 'newest':
                reqBody.sort(builder.sort('created_at.epoch', sortDirection || 'desc'));
                break;
            case 'popular':
                reqBody.sort(builder.sort('number_of_followers', sortDirection || 'desc'));
                break;
            default:
                reqBody.sort(builder.sort('created_at.epoch', sortDirection || 'desc'));
        }
    }
    const finalBool = builder.boolQuery().must(queries);
    return reqBody.query(finalBool);
}
exports.getPlaylistESQueryForRegularFilter = getPlaylistESQueryForRegularFilter;
async function getPlaylistFilterResultsFromES(queryParams) {
    const esQuery = getPlaylistESQueryForRegularFilter(queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.PLAYLIST, esQuery);
}
exports.getPlaylistFilterResultsFromES = getPlaylistFilterResultsFromES;
async function filterPlaylists(queryParams) {
    const resultsFromES = await getPlaylistFilterResultsFromES(queryParams);
    return {
        total: resultsFromES.total,
        items: transform_service_1.default(resultsFromES.items),
    };
}
exports.filterPlaylists = filterPlaylists;
//# sourceMappingURL=playlist.filter.service.js.map