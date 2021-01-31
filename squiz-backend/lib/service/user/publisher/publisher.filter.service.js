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
exports.filterPublishers = exports.getPublisherFilterResultsFromES = exports.getPublisherESQueryForRegularFilter = void 0;
const builder = __importStar(require("elastic-builder"));
const user_model_1 = require("../../../model/user/user.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
// import logger from '../../../shared/logger';
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const elastic_service_1 = require("../../shared/elastic.service");
const transform_service_1 = __importDefault(require("../../shared/transform.service"));
// const log = logger(path.relative(process.cwd(), __filename));
function getPublisherESQueryForRegularFilter(queryParams) {
    var _a, _b, _c, _d, _e, _f, _g;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const starts_with = (_b = queryParams.starts_with) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const geo_distance = (_c = queryParams.geo_distance) === null || _c === void 0 ? void 0 : _c.toString().trim();
    const geo_pin = (_d = queryParams.geo_pin) === null || _d === void 0 ? void 0 : _d.toString().trim();
    const ids = (_e = queryParams.ids) === null || _e === void 0 ? void 0 : _e.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const sort_option = (_f = queryParams.sort_option) === null || _f === void 0 ? void 0 : _f.toString().trim();
    const sort_direction = (_g = queryParams.sort_direction) === null || _g === void 0 ? void 0 : _g.toString().trim();
    const queries = [];
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(user_model_1.USER_SUMMARY_FIELDS);
    if (sort_option) {
        switch (sort_option.toLowerCase()) {
            case 'popular':
                reqBody.sort(builder.sort('publisher_follower_count', sort_direction || 'desc'));
                break;
            case 'alphabetical':
                reqBody.sort(builder.sort('name.keyword', sort_direction || 'asc'));
                break;
            case 'newest':
                reqBody.sort(builder.sort('created_at.epoch', sort_direction || 'desc'));
                break;
            default:
                reqBody.sort(builder.sort('name.keyword', sort_direction || 'asc'));
        }
    }
    const matchQuery = keyword ? builder.matchQuery('name', keyword) : builder.matchAllQuery();
    queries.push(builder.boolQuery().must(matchQuery));
    queries.push(builder.boolQuery().must(builder.matchQuery('is_publisher', 'true'.toLowerCase())));
    if (starts_with) {
        queries.push(builder
            .boolQuery()
            .should(starts_with.split(',').map((val) => builder.prefixQuery('name.keyword', val)))
            .minimumShouldMatch(1));
    }
    if (geo_pin && geo_distance) {
        queries.push(builder
            .boolQuery()
            .filter(builder.geoDistanceQuery('region.location', builder.geoPoint().string(geo_pin)).distance(geo_distance)));
    }
    if (ids) {
        queries.push(builder
            .boolQuery()
            .should(ids.split(',').map((val) => builder.matchQuery('id', val)))
            .minimumShouldMatch(1));
    }
    return reqBody.query(builder.boolQuery().must(queries));
}
exports.getPublisherESQueryForRegularFilter = getPublisherESQueryForRegularFilter;
async function getPublisherFilterResultsFromES(queryParams) {
    const esQuery = getPublisherESQueryForRegularFilter(queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.USER, esQuery);
}
exports.getPublisherFilterResultsFromES = getPublisherFilterResultsFromES;
async function filterPublishers(queryParams) {
    const resultsFromES = await getPublisherFilterResultsFromES(queryParams);
    return {
        total: resultsFromES.total,
        items: transform_service_1.default(resultsFromES.items),
    };
}
exports.filterPublishers = filterPublishers;
//# sourceMappingURL=publisher.filter.service.js.map