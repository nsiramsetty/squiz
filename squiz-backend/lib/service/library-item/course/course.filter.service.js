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
exports.filterCourses = exports.getCourseFilterResultsFromES = exports.getESQueryForCoursesFilter = void 0;
const builder = __importStar(require("elastic-builder"));
const library_item_model_1 = require("../../../model/library-item/library-item.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
// import logger from '../../../shared/logger';
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const categorization_service_1 = __importDefault(require("../../shared/categorization.service"));
const elastic_service_1 = require("../../shared/elastic.service");
const i18n_service_1 = require("../../shared/i18n.service");
const transform_service_1 = __importDefault(require("../../shared/transform.service"));
const single_track_filter_service_1 = require("../single-track/single-track.filter.service");
// const log = logger(path.relative(process.cwd(), __filename));
function getESQueryForCoursesFilter(deviceLang, offset, limit, queryParams) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const filter = (_a = queryParams.filter) === null || _a === void 0 ? void 0 : _a.toString();
    const topics = queryParams.topics ? queryParams.topics.toString().split(',') : [];
    const sortOption = (_b = queryParams.sort_option) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const sortDirection = (_c = queryParams.sort_direction) === null || _c === void 0 ? void 0 : _c.toString().trim();
    const ignoreLangs = query_parameter_parser_1.booleanOrDefault((_d = queryParams.ignore_langs) === null || _d === void 0 ? void 0 : _d.toString().trim(), false);
    const publisherIds = queryParams.publisher_ids
        ? (_e = queryParams.publisher_ids) === null || _e === void 0 ? void 0 : _e.toString().trim().split(',') : [];
    const ids = queryParams.ids ? (_f = queryParams.ids) === null || _f === void 0 ? void 0 : _f.toString().split(',') : [];
    const queries = [];
    const languagesQuery = single_track_filter_service_1.combineRequestedLanguages((_g = queryParams.device_lang) === null || _g === void 0 ? void 0 : _g.toString().trim(), (_h = queryParams.content_lang) === null || _h === void 0 ? void 0 : _h.toString().trim());
    const reqBody = builder
        .requestBodySearch()
        .source(library_item_model_1.COURSE_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
    const mainQuery = builder
        .boolQuery()
        .must(builder.matchAllQuery())
        .filter(builder.boolQuery().must(builder.termQuery('item_type.keyword', enum_1.ItemType.COURSES)));
    const contextFilterQueries = categorization_service_1.default(queryParams);
    for (let i = 0; i < contextFilterQueries.length; i += 1) {
        mainQuery.should(contextFilterQueries[i]);
    }
    if (contextFilterQueries.length > 0) {
        mainQuery.minimumShouldMatch(1);
    }
    queries.push(mainQuery);
    if (filter) {
        queries.push(builder.boolQuery().must(builder.matchQuery('filters.name', filter)));
    }
    if (topics.length) {
        queries.push(builder.termsQuery('topics.keyword', topics));
    }
    if (publisherIds.length) {
        queries.push(builder
            .boolQuery()
            .should(publisherIds.map((val) => builder.matchQuery('publisher.id', val))));
    }
    if (ids.length) {
        queries.push(builder.boolQuery().should(ids.map((val) => builder.matchQuery('id', val))));
    }
    if (!ignoreLangs && languagesQuery && languagesQuery.length > 0) {
        queries.push(builder.boolQuery().should(languagesQuery));
    }
    if (sortOption) {
        switch (sortOption.toLowerCase()) {
            case 'highest_rated':
                reqBody.sort(builder.sort('rating_score', sortDirection || 'desc'));
                break;
            case 'newest':
                reqBody.sort(builder.sort('approved_at.iso_8601_datetime_tz', sortDirection || 'desc'));
                break;
            case 'popular':
                reqBody.sort(builder.sort('number_of_students', sortDirection || 'desc'));
                break;
            default:
                break;
        }
    }
    const finalQuery = builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(queries))
        .functions([
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 5 : 17),
        builder.weightScoreFunction().filter(builder.termQuery('item_type.keyword', enum_1.ItemType.COURSES)).weight(10),
    ])
        .boostMode('sum')
        .scoreMode('sum')
        .boost(1.2);
    return reqBody.query(finalQuery);
}
exports.getESQueryForCoursesFilter = getESQueryForCoursesFilter;
async function getCourseFilterResultsFromES(offset, limit, deviceLang, queryParams) {
    const esQuery = getESQueryForCoursesFilter(deviceLang, offset, limit, queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.LIBRARY_ITEM, esQuery);
}
exports.getCourseFilterResultsFromES = getCourseFilterResultsFromES;
async function filterCourses(queryParams) {
    var _a;
    const deviceLang = i18n_service_1.validateAndReplaceWithEnglish([(_a = queryParams.device_lang) === null || _a === void 0 ? void 0 : _a.toString().trim()])[0];
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const resultsFromES = await getCourseFilterResultsFromES(offset, limit, deviceLang, queryParams);
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.filterCourses = filterCourses;
//# sourceMappingURL=course.filter.service.js.map