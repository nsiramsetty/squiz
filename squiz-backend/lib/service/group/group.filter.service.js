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
exports.filterGroups = exports.getGroupFilterResultsFromES = exports.getGroupSearchResultsFromFS = exports.getESQueryForGroupsRegularFilter = void 0;
const builder = __importStar(require("elastic-builder"));
const path_1 = __importDefault(require("path"));
const group_model_1 = require("../../model/group/group.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const logger_1 = __importDefault(require("../../shared/logger"));
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function getESQueryForGroupsRegularFilter(queryParams) {
    var _a, _b, _c, _d, _e, _f;
    const query = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const group_types = (_b = queryParams.group_types) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const privacy_types = (_c = queryParams.privacy_types) === null || _c === void 0 ? void 0 : _c.toString().trim();
    const include_hidden = query_parameter_parser_1.booleanOrDefault(queryParams.include_hidden, false);
    const include_deleted = query_parameter_parser_1.booleanOrDefault(queryParams.include_deleted, false);
    const email_domains = queryParams.email_domains ? (_d = queryParams.email_domains) === null || _d === void 0 ? void 0 : _d.toString().split(',') : [];
    const sort_option = (_e = queryParams.sort_option) === null || _e === void 0 ? void 0 : _e.toString().trim();
    const sort_direction = (_f = queryParams.sort_direction) === null || _f === void 0 ? void 0 : _f.toString().trim();
    const queries = [];
    const reqBody = builder
        .requestBodySearch()
        .from(offset)
        .size(limit)
        .source(group_model_1.GROUP_SUMMARY_FIELDS);
    if (!query && sort_option) {
        switch (sort_option.toLowerCase()) {
            case 'newest':
                reqBody.sort(builder.sort('created_at.epoch', sort_direction || 'desc'));
                break;
            case 'most_members':
                reqBody.sort(builder.sort('member_count', sort_direction || 'desc'));
                break;
            default:
                break;
        }
    }
    queries.push(builder.boolQuery().mustNot(builder.matchQuery('type.keyword', 'LEGACY')));
    queries.push(builder
        .boolQuery()
        .should([builder.matchQuery('type.keyword', 'GROUP'), builder.matchQuery('type.keyword', 'ENTERPRISE')])
        .minimumShouldMatch(1));
    if (group_types && group_types.trim() !== '') {
        const group_types_array = group_types.split(',');
        if (group_types_array.length > 0) {
            queries.push(builder
                .boolQuery()
                .should(group_types_array.map((val) => builder.matchQuery('type', val)))
                .minimumShouldMatch(1));
        }
    }
    if (privacy_types && privacy_types.trim() !== '') {
        const privacy_types_array = privacy_types.split(',');
        if (privacy_types_array.length > 0) {
            queries.push(builder
                .boolQuery()
                .should(privacy_types_array.map((val) => builder.matchQuery('privacy_type', val)))
                .minimumShouldMatch(1));
        }
    }
    if (!include_hidden) {
        queries.push(builder
            .boolQuery()
            .should([
            builder.matchQuery('privacy_type.keyword', 'PUBLIC'),
            builder
                .boolQuery()
                .must([builder.matchQuery('privacy_type.keyword', 'PRIVATE'), builder.termQuery('privacy_hidden', false)]),
        ])
            .minimumShouldMatch(1));
    }
    if (!include_deleted) {
        queries.push(builder.boolQuery().mustNot(builder.termQuery('is_deleted', true)));
    }
    if (email_domains.length) {
        queries.push(builder
            .boolQuery()
            .should(email_domains.map((val) => builder.matchQuery('email_domains', val)))
            .minimumShouldMatch(1));
    }
    const matchQuery = query ? builder.multiMatchQuery(['name'], query).fuzziness(2) : builder.matchAllQuery();
    queries.push(builder.boolQuery().must(matchQuery));
    return reqBody.query(builder.boolQuery().must(queries));
}
exports.getESQueryForGroupsRegularFilter = getESQueryForGroupsRegularFilter;
async function getGroupSearchResultsFromFS(queryParams) {
    var _a;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'name',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    conditionsForSearch.push({
        fieldPath: 'type',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: 'GROUP',
    });
    conditionsForSearch.push({
        fieldPath: 'privacy_type',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: 'PUBLIC',
    });
    conditionsForSearch.push({
        fieldPath: 'privacy_hidden',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: false,
    });
    const conditionsForSort = [];
    const fieldMasks = group_model_1.GROUP_SUMMARY_FIELDS;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.GROUPS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
exports.getGroupSearchResultsFromFS = getGroupSearchResultsFromFS;
async function getGroupFilterResultsFromES(queryParams) {
    const esQuery = getESQueryForGroupsRegularFilter(queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.GROUP, esQuery, true);
}
exports.getGroupFilterResultsFromES = getGroupFilterResultsFromES;
async function filterGroups(queryParams) {
    try {
        const resultsFromES = await getGroupFilterResultsFromES(queryParams);
        return {
            total: resultsFromES.total,
            items: transform_service_1.default(resultsFromES.items),
        };
    }
    catch (error) {
        log.error(`filterGroups:: ${error}`);
        const resultsFromFS = await getGroupSearchResultsFromFS(queryParams);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
}
exports.filterGroups = filterGroups;
//# sourceMappingURL=group.filter.service.js.map