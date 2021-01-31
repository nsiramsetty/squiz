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
exports.filterDailyInsight = exports.getDailyInsightFilterResultsFromES = exports.getDailyInsightESQuery = exports.combineRequestedLanguages = void 0;
const builder = __importStar(require("elastic-builder"));
const _ = __importStar(require("lodash"));
const library_item_model_1 = require("../../../model/library-item/library-item.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
// import logger from '../../../shared/logger';
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const elastic_service_1 = require("../../shared/elastic.service");
const transform_service_1 = __importDefault(require("../../shared/transform.service"));
// const log = logger(path.relative(process.cwd(), __filename));
function combineRequestedLanguages(deviceLang, contentLang) {
    let requestedLang = [];
    if (typeof contentLang === 'string') {
        if (contentLang && contentLang.trim() !== '') {
            contentLang
                .split(',')
                .filter((l) => l.trim() !== '')
                .map((l) => l.trim())
                .forEach((l) => requestedLang.push(l));
        }
    }
    else if (Array.isArray(contentLang)) {
        requestedLang = contentLang;
    }
    // device lang should not be added to the search request.
    // it should only help boost the results if the device lang matches one of the content Lang
    // so i'm pushing the device lang to the top of the array so it has a higher boost factor.
    if (requestedLang.indexOf(deviceLang) > -1) {
        requestedLang.unshift(deviceLang);
    }
    requestedLang = _.uniq(requestedLang);
    let boostFactor = 32;
    const requestedLangQueries = requestedLang.map((l) => {
        const query = new builder.MatchQuery('lang.iso_639_1', l);
        boostFactor = boostFactor / 2 || 1;
        return query;
    });
    if (requestedLangQueries.length === 0) {
        const query = new builder.MatchQuery('lang.iso_639_1', 'en');
        requestedLangQueries.push(query);
    }
    return requestedLangQueries;
}
exports.combineRequestedLanguages = combineRequestedLanguages;
function getDailyInsightESQuery(queryParams) {
    var _a, _b, _c, _d, _e, _f;
    const type = (_a = queryParams.type) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const languagesQuery = combineRequestedLanguages((_b = queryParams.device_lang) === null || _b === void 0 ? void 0 : _b.toString().trim(), (_c = queryParams.content_lang) === null || _c === void 0 ? void 0 : _c.toString().trim());
    const sortOption = (_d = queryParams.sort_option) === null || _d === void 0 ? void 0 : _d.toString().trim();
    const sortDirection = (_e = queryParams.sort_direction) === null || _e === void 0 ? void 0 : _e.toString().trim();
    const publisherId = (_f = queryParams.publisher_id) === null || _f === void 0 ? void 0 : _f.toString().trim();
    const today = new Date().toISOString().substr(0, 10);
    const queries = [];
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(library_item_model_1.DAILY_INSIGHT_ITEM_SUMMARY_FIELDS);
    const dateQuery = type === enum_1.DailyInsightType.CURRENT
        ? builder.rangeQuery('calendar_id').lte(today)
        : builder.rangeQuery('calendar_id').gte(today);
    queries.push(builder.boolQuery().must(dateQuery));
    const filteredQuery = builder
        .boolQuery()
        .must(builder.matchAllQuery())
        .filter(builder.boolQuery().must(builder.termQuery('item_type.keyword', 'DAILY_INSIGHT')));
    queries.push(filteredQuery);
    queries.push(builder.boolQuery().should(languagesQuery));
    if (sortOption) {
        switch (sortOption.toLowerCase()) {
            case 'latest':
                reqBody.sort(builder.sort('calendar_id', sortDirection || 'desc'));
                break;
            default:
                reqBody.sort(builder.sort('calendar_id', sortDirection || 'desc'));
        }
    }
    else {
        reqBody.sort(builder.sort('calendar_id', sortDirection || 'desc'));
    }
    if (publisherId) {
        const publisherIdQuery = builder.boolQuery().must(builder.matchQuery('publisher.id', publisherId));
        queries.push(publisherIdQuery);
    }
    const finalBool = builder.boolQuery().must(queries);
    return reqBody.query(finalBool);
}
exports.getDailyInsightESQuery = getDailyInsightESQuery;
async function getDailyInsightFilterResultsFromES(queryParams) {
    const esQuery = getDailyInsightESQuery(queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.LIBRARY_ITEM, esQuery);
}
exports.getDailyInsightFilterResultsFromES = getDailyInsightFilterResultsFromES;
async function filterDailyInsight(queryParams) {
    const resultsFromES = await getDailyInsightFilterResultsFromES(queryParams);
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.filterDailyInsight = filterDailyInsight;
//# sourceMappingURL=daily-insight.filter.service.js.map