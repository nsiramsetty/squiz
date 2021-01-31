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
exports.trendingHashtags = exports.getTrendingHashtagFilterResultsFromES = exports.getESQueryForTrendingHashtagsFilter = void 0;
const builder = __importStar(require("elastic-builder"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const axios_helper_1 = require("../../helper/axios.helper");
const hashtag_model_1 = require("../../model/hashtag/hashtag.model");
const enum_1 = require("../../shared/enum");
const logger_1 = __importDefault(require("../../shared/logger"));
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function getESQueryForTrendingHashtagsFilter(queryParams) {
    const days = query_parameter_parser_1.numberOrDefault(queryParams.days, 0);
    const reqBody = builder
        .requestBodySearch()
        .from(0)
        .size(0)
        .source(hashtag_model_1.TRENDING_HASHTAG_SUMMARY_FIELDS);
    if (days > 0) {
        reqBody.agg(builder
            .filterAggregation('date_range', builder.rangeQuery('created_at.iso_8601_datetime_tz').format('dd-MM-yyyy').gte(`now-${days}d/d`))
            .agg(builder.termsAggregation('hashtags', 'hashtags.keyword')));
    }
    else {
        reqBody.agg(builder.termsAggregation('hashtags', 'hashtags.keyword'));
    }
    return reqBody;
}
exports.getESQueryForTrendingHashtagsFilter = getESQueryForTrendingHashtagsFilter;
async function getTrendingHashtagFilterResultsFromES(queryParams, fieldMasks, esIndex, esClient) {
    const esQuery = getESQueryForTrendingHashtagsFilter(queryParams);
    return esClient
        .post(`${esIndex}/_search`, `${JSON.stringify(esQuery)}`)
        .then((response) => {
        const { data } = response;
        const hashtags = lodash_1.default.get(data, 'aggregations.date_range.hashtags.buckets') || lodash_1.default.get(data, 'aggregations.hashtags.buckets');
        const results = hashtags.map((o) => {
            return {
                hashtag: o.key,
            };
        });
        return {
            total: results.length,
            items: results,
        };
    })
        .catch((error) => {
        log.error(`ES Search Error => ${error.stack}.`);
        return {
            total: 0,
            items: [],
        };
    });
}
exports.getTrendingHashtagFilterResultsFromES = getTrendingHashtagFilterResultsFromES;
async function trendingHashtags(queryParams) {
    const resultsFromES = await getTrendingHashtagFilterResultsFromES(queryParams, hashtag_model_1.TRENDING_HASHTAG_SUMMARY_FIELDS, enum_1.ESIndex.PLAYLIST, axios_helper_1.ESDefaultClient);
    return { items: resultsFromES.items, total: resultsFromES.total };
}
exports.trendingHashtags = trendingHashtags;
//# sourceMappingURL=hashtag.trending.service.js.map