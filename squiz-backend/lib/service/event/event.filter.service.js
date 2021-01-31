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
exports.getHomeCarouselEvents = exports.filterEvents = exports.getEventFilterResultsFromFS = exports.getEventsFilterResultsFromES = exports.getEventESQueryForRegularFilter = void 0;
const builder = __importStar(require("elastic-builder"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const event_model_1 = require("../../model/event/event.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
const logger_1 = __importDefault(require("../../shared/logger"));
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const i18n_service_1 = require("../shared/i18n.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function getEventESQueryForRegularFilter(queryParams) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const epoch = moment_1.default.utc().valueOf();
    const include_all_privacy = query_parameter_parser_1.booleanOrDefault(queryParams.include_all_privacy, false);
    const include_all_status = query_parameter_parser_1.booleanOrDefault(queryParams.include_all_status, false);
    const geo_distance = (_b = queryParams.geo_distance) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const geo_pin = (_c = queryParams.geo_pin) === null || _c === void 0 ? void 0 : _c.toString().trim();
    const sort_option = (_d = queryParams.sort_option) === null || _d === void 0 ? void 0 : _d.toString().trim();
    const sort_direction = (_e = queryParams.sort_direction) === null || _e === void 0 ? void 0 : _e.toString().trim();
    const hashtags = (_f = queryParams.hashtags) === null || _f === void 0 ? void 0 : _f.toString().trim();
    const contentFilters = (_g = queryParams.content_filters) === null || _g === void 0 ? void 0 : _g.toString().trim();
    const content_types = (_h = queryParams.content_types) === null || _h === void 0 ? void 0 : _h.toString().trim();
    const occurrence_types = (_j = queryParams.occurrence_types) === null || _j === void 0 ? void 0 : _j.toString().trim();
    const owner_ids = (_k = queryParams.owner_ids) === null || _k === void 0 ? void 0 : _k.toString().trim();
    const type = (_l = queryParams.type) === null || _l === void 0 ? void 0 : _l.toString().trim();
    const languages = i18n_service_1.getCombinedLanguages((_m = queryParams.device_lang) === null || _m === void 0 ? void 0 : _m.toString().trim(), (_o = queryParams.content_langs) === null || _o === void 0 ? void 0 : _o.toString().trim());
    const startDateFrom = (_p = queryParams.start_date_from) === null || _p === void 0 ? void 0 : _p.toString().trim();
    const startDateTo = (_q = queryParams.start_date_to) === null || _q === void 0 ? void 0 : _q.toString().trim();
    const endDateFrom = (_r = queryParams.end_date_from) === null || _r === void 0 ? void 0 : _r.toString().trim();
    const endDateTo = (_s = queryParams.end_date_to) === null || _s === void 0 ? void 0 : _s.toString().trim();
    const queries = [];
    const functionQueries = [];
    const fromTime = moment_1.default().subtract('2', 'hours').utc().valueOf();
    const toTime = moment_1.default().add('2', 'hours').utc().valueOf();
    const upcomingTime = moment_1.default().add('5', 'days').utc().valueOf();
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(event_model_1.EVENT_SUMMARY_FIELDS);
    if (sort_option || sort_direction) {
        switch (sort_option.toLowerCase()) {
            case 'start_date':
                reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', sort_direction || 'asc'));
                break;
            case 'end_date':
                reqBody.sort(builder.sort('_next_occurrences.end_date.epoch', sort_direction || 'asc'));
                break;
            default:
                reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', sort_direction || 'asc'));
                break;
        }
    }
    else {
        reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', sort_direction || 'asc'));
    }
    if (keyword) {
        const matchQuery = builder.multiMatchQuery(['title', 'description'], keyword);
        queries.push(builder.boolQuery().must(matchQuery));
    }
    if (type) {
        queries.push(builder.boolQuery().must(builder.matchQuery('type.keyword', type)));
    }
    if (!include_all_status) {
        queries.push(builder.boolQuery().must(builder.matchQuery('status.keyword', enum_1.EventStatus.APPROVED)));
    }
    if (!include_all_privacy) {
        queries.push(builder.boolQuery().must(builder.matchQuery('privacy.keyword', enum_1.EventPrivacy.PUBLIC)));
    }
    if (hashtags && hashtags.trim() !== '') {
        const hashtags_array = hashtags.split(',');
        if (hashtags_array.length > 0) {
            queries.push(builder
                .boolQuery()
                .should(hashtags_array.map((val) => builder.matchQuery('hashtags.keyword', val)))
                .minimumShouldMatch(1));
        }
    }
    if (contentFilters && contentFilters.trim() !== '') {
        const filter_array = contentFilters.split(',');
        if (filter_array.length > 0) {
            let hashtagsList = [];
            filter_array.forEach((content_filter) => {
                if (event_model_1.EventContentFilterMapping[content_filter]) {
                    hashtagsList = hashtagsList.concat(event_model_1.EventContentFilterMapping[content_filter]);
                }
            });
            if (hashtagsList.length > 0) {
                queries.push(builder
                    .boolQuery()
                    .should(hashtagsList.map((val) => {
                    return builder.matchQuery('hashtags.keyword', val);
                }))
                    .minimumShouldMatch(1));
            }
        }
    }
    if (content_types && content_types.trim() !== '') {
        const content_types_array = content_types.split(',');
        if (content_types_array.length > 0) {
            queries.push(builder
                .boolQuery()
                .should(content_types_array.map((val) => builder.matchQuery('_next_occurrences.broadcast_summary.content_type', val)))
                .minimumShouldMatch(1));
        }
    }
    if (owner_ids && owner_ids.trim() !== '') {
        const owner_ids_array = owner_ids.split(',');
        if (owner_ids_array.length > 0) {
            queries.push(builder
                .boolQuery()
                .should(owner_ids_array.map((val) => builder.matchQuery('owner.id', val)))
                .minimumShouldMatch(1));
        }
    }
    if (occurrence_types && occurrence_types.trim() !== '') {
        const occurrence_types_array = occurrence_types.split(',');
        if (occurrence_types_array.length > 0) {
            const event_type_queries = [];
            occurrence_types_array.forEach((event_type) => {
                switch (event_type.toLowerCase()) {
                    case 'future':
                        event_type_queries.push(builder.rangeQuery('_next_occurrences.start_date.epoch').gt(epoch));
                        break;
                    case 'past':
                        event_type_queries.push(builder.rangeQuery('_next_occurrences.end_date.epoch').lt(epoch));
                        break;
                    case 'live':
                        event_type_queries.push(builder
                            .boolQuery()
                            .must([
                            builder.rangeQuery('_next_occurrences.start_date.epoch').lte(epoch),
                            builder.rangeQuery('_next_occurrences.end_date.epoch').gte(epoch),
                        ]));
                        break;
                    case 'live_stories':
                        event_type_queries.push(builder
                            .boolQuery()
                            .must([
                            builder.rangeQuery('_next_occurrences.start_date.epoch').lte(toTime),
                            builder.rangeQuery('_next_occurrences.start_date.epoch').gte(fromTime),
                        ]));
                        break;
                    case 'upcoming_soon':
                        event_type_queries.push(builder
                            .boolQuery()
                            .must([
                            builder.rangeQuery('_next_occurrences.start_date.epoch').lte(upcomingTime),
                            builder.rangeQuery('_next_occurrences.start_date.epoch').gte(toTime),
                        ]));
                        break;
                    default:
                        break;
                }
            });
            if (event_type_queries.length > 0) {
                queries.push(builder.boolQuery().should(event_type_queries).minimumShouldMatch(1));
            }
        }
    }
    /* if (languages.length) {
      languages.forEach((lang): void => {
        functionQueries.push(builder.weightScoreFunction().filter(builder.termQuery('lang.iso_639_1', lang)).weight(100));
      });
    } */
    // as per cyrus suggestion to temporary add english as if languages doesn't contain english
    if (languages.length > 0 && languages.indexOf(enum_1.SupportedLanguage.ENGLISH) === -1) {
        languages.push(enum_1.SupportedLanguage.ENGLISH);
    }
    if (languages.length > 0) {
        queries.push(builder
            .boolQuery()
            .should(languages.map((val) => builder.matchQuery('lang.iso_639_1', val)))
            .minimumShouldMatch(1));
    }
    if (geo_pin) {
        const geoPinPoints = geo_pin.split(',');
        queries.push(builder.boolQuery().filter(builder
            .geoDistanceQuery('owner.region.location', builder.geoPoint().object({
            lon: geoPinPoints[0],
            lat: geoPinPoints[1],
        }))
            .distance(geo_distance)));
    }
    if (startDateFrom && query_parameter_parser_1.checkIsDecimal(startDateFrom)) {
        queries.push(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(startDateFrom));
    }
    if (startDateTo && query_parameter_parser_1.checkIsDecimal(startDateTo)) {
        queries.push(builder.rangeQuery('_next_occurrences.start_date.epoch').lte(startDateTo));
    }
    if (endDateFrom && query_parameter_parser_1.checkIsDecimal(endDateFrom)) {
        queries.push(builder.rangeQuery('_next_occurrences.end_date.epoch').gte(endDateFrom));
    }
    if (endDateTo && query_parameter_parser_1.checkIsDecimal(endDateTo)) {
        queries.push(builder.rangeQuery('_next_occurrences.end_date.epoch').lte(endDateTo));
    }
    return reqBody.query(builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(queries))
        .functions(functionQueries)
        .boostMode('sum')
        .scoreMode('sum'));
}
exports.getEventESQueryForRegularFilter = getEventESQueryForRegularFilter;
async function getEventsFilterResultsFromES(queryParams) {
    const esQuery = getEventESQueryForRegularFilter(queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.EVENT, esQuery);
}
exports.getEventsFilterResultsFromES = getEventsFilterResultsFromES;
async function getEventFilterResultsFromFS(queryParams) {
    var _a, _b;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const type = (_b = queryParams.type) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'type',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: type,
    });
    conditionsForSearch.push({
        fieldPath: 'title',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    const conditionsForSort = [];
    const fieldMasks = event_model_1.EVENT_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.EVENTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
exports.getEventFilterResultsFromFS = getEventFilterResultsFromFS;
async function filterEvents(queryParams) {
    var _a;
    const type = (_a = queryParams.type) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!type) {
        throw new http_400_error_1.default(`Filter Events :: type :: is Required for Events Filter.`);
    }
    try {
        const resultsFromES = await getEventsFilterResultsFromES(queryParams);
        const resultsFromESItems = resultsFromES.items;
        resultsFromESItems.forEach((item) => {
            var _a;
            const nextOccurrences = (_a = item._next_occurrences) === null || _a === void 0 ? void 0 : _a.map((x) => {
                const occurrence = lodash_1.default.pick(x, event_model_1.OCCURRENCE_SUMMARY_FIELDS);
                return occurrence;
            });
            Object.assign(item, { _next_occurrences: nextOccurrences });
        });
        return {
            total: resultsFromES.total,
            items: transform_service_1.default(resultsFromES.items),
        };
    }
    catch (error) {
        log.error(`filterEvents:: ${JSON.stringify(error)}`);
        const resultsFromFS = await getEventFilterResultsFromFS(queryParams);
        return { total: resultsFromFS.total, items: transform_service_1.default(resultsFromFS.items) };
    }
}
exports.filterEvents = filterEvents;
async function getHomeCarouselEvents() {
    const queryParamsForHomeCarousel = {};
    Object.assign(queryParamsForHomeCarousel, { offset: 0 });
    Object.assign(queryParamsForHomeCarousel, { limit: 10 });
    Object.assign(queryParamsForHomeCarousel, { type: 'LIVE_STREAM' });
    Object.assign(queryParamsForHomeCarousel, { occurrence_types: 'live,future' });
    Object.assign(queryParamsForHomeCarousel, { sort_option: 'start_date' });
    Object.assign(queryParamsForHomeCarousel, { sort_direction: 'asc' });
    return filterEvents(queryParamsForHomeCarousel);
}
exports.getHomeCarouselEvents = getHomeCarouselEvents;
//# sourceMappingURL=event.filter.service.js.map