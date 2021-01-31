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
exports.searchGroups = exports.getGroupSearchResultsFromES = exports.getGroupSearchResultsFromFS = exports.getESQueryForGroupsTopViewSearch = exports.getESQueryForGroupsRegularSearch = exports.getFriendsRegisteredWithGroups = exports.getUserWorkspaceEmails = void 0;
const builder = __importStar(require("elastic-builder"));
const path_1 = __importDefault(require("path"));
const group_model_1 = require("../../model/group/group.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
const logger_1 = __importDefault(require("../../shared/logger"));
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
async function getUserWorkspaceEmails(userID) {
    const colletionPath = `${enum_1.Collection.USERS}/${userID}/private/settings/email_addresses`;
    const conditionsForSearch = [];
    const conditionsForSort = [];
    const offset = 0;
    const limit = 10000;
    const fieldMasks = ['email_id', 'is_verified', 'is_deleted'];
    const resultsFromFS = await firestore_service_1.getFirestoreDocuments(colletionPath, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
    const items = resultsFromFS.items;
    return items;
}
exports.getUserWorkspaceEmails = getUserWorkspaceEmails;
async function getFriendsRegisteredWithGroups(friends) {
    const resultsFromES = await elastic_service_1.getDocumentsByIDListFromES(friends, enum_1.ESIndex.USER_RELATION, ['groups']);
    const friendMap = new Map();
    resultsFromES.items.forEach((e) => {
        var _a;
        (_a = e.groups) === null || _a === void 0 ? void 0 : _a.forEach((group) => {
            if (friendMap.get(group)) {
                const existingList = friendMap.get(group);
                existingList === null || existingList === void 0 ? void 0 : existingList.push(e.id);
                friendMap.set(group, existingList);
            }
            else {
                const existingList = [e.id];
                friendMap.set(group, existingList);
            }
        });
    });
    return Promise.resolve(friendMap);
}
exports.getFriendsRegisteredWithGroups = getFriendsRegisteredWithGroups;
async function getESQueryForGroupsRegularSearch(keyword, offset, limit, queryParams) {
    var _a, _b;
    const searchFields = ['name^4', 'long_description', 'created_by.name'];
    const queries = [];
    const domains = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.include_email_domains) ? (_a = queryParams.include_email_domains) === null || _a === void 0 ? void 0 : _a.toString().split(',') : [];
    const deviceLang = (_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.device_lang) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const scoreFunctions = [
        builder.weightScoreFunction().filter(builder.termQuery('name.keyword', keyword)).weight(50),
        builder.weightScoreFunction().filter(builder.multiMatchQuery(searchFields, keyword).fuzziness(0)).weight(25),
        builder.fieldValueFactorFunction('member_count').factor(0.0009).modifier('sqrt').missing(0),
    ];
    if (deviceLang) {
        scoreFunctions.push(builder.weightScoreFunction().filter(builder.termQuery('created_by_device_lang', deviceLang)).weight(10));
    }
    queries.push(builder.multiMatchQuery(searchFields, keyword).fuzziness(2));
    queries.push(builder.boolQuery().mustNot(builder.matchQuery('type.keyword', 'LEGACY')));
    queries.push(builder.boolQuery().mustNot(builder.termQuery('is_deleted', true)));
    queries.push(builder.boolQuery().must(builder.matchQuery('privacy_type.keyword', 'PUBLIC')));
    queries.push(builder.boolQuery().must(builder.termQuery('privacy_hidden', false)));
    if (domains && Array.isArray(domains) && domains.length > 0) {
        queries.push(builder
            .boolQuery()
            .should([
            builder.matchQuery('type.keyword', 'GROUP'),
            builder
                .boolQuery()
                .should(domains.map((val) => builder.matchQuery('email_domains', val)))
                .minimumShouldMatch(1),
        ])
            .minimumShouldMatch(1));
    }
    else {
        queries.push(builder.boolQuery().must(builder.matchQuery('type.keyword', 'GROUP')));
    }
    const mainQuery = builder.boolQuery().must(queries);
    return builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(mainQuery).functions(scoreFunctions).scoreMode('sum').boostMode('sum'))
        .source(group_model_1.GROUP_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForGroupsRegularSearch = getESQueryForGroupsRegularSearch;
function getESQueryForGroupsTopViewSearch(keyword, offset, limit, deviceLang) {
    const searchFields = [
        'name^3',
        'hashtags',
        'long_description',
        'short_description',
        'region.name',
        'created_by.name',
    ];
    const mainQuery = builder.boolQuery().must([
        builder.multiMatchQuery(searchFields, keyword).fuzziness(1).type('most_fields'),
        builder.boolQuery().mustNot(builder.matchQuery('type.keyword', 'LEGACY')),
        builder.boolQuery().mustNot(builder.termQuery('is_deleted', true)),
        builder
            .boolQuery()
            .should([
            builder.matchQuery('privacy_type.keyword', 'PUBLIC'),
            builder
                .boolQuery()
                .must([builder.matchQuery('privacy_type.keyword', 'PRIVATE'), builder.termQuery('privacy_hidden', false)]),
        ])
            .minimumShouldMatch(1),
        builder
            .boolQuery()
            .should([builder.matchQuery('type.keyword', 'GROUP'), builder.matchQuery('type.keyword', 'ENTERPRISE')])
            .minimumShouldMatch(1),
    ]);
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
        builder.weightScoreFunction().filter(builder.termQuery('language.iso_639_1.keyword', deviceLang)).weight(2.2),
        builder.fieldValueFactorFunction('member_count').factor(0.009).modifier('sqrt').missing(0),
        builder.weightScoreFunction().filter(builder.termQuery('name.keyword', keyword)).weight(20),
    ])
        .scoreMode('sum')
        .boostMode('sum'))
        .source(group_model_1.GROUP_SUMMARY_TOP_VIEW_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForGroupsTopViewSearch = getESQueryForGroupsTopViewSearch;
async function getGroupSearchResultsFromFS(keyword, offset, limit) {
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
async function getGroupSearchResultsFromES(keyword, offset, limit, queryParams) {
    const esQuery = await getESQueryForGroupsRegularSearch(keyword, offset, limit, queryParams);
    const esResult = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.GROUP, esQuery);
    return esResult;
}
exports.getGroupSearchResultsFromES = getGroupSearchResultsFromES;
async function searchGroups(queryParams) {
    var _a;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`searchGroups :: Parameter => query :: is Required`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    try {
        const resultsFromES = await getGroupSearchResultsFromES(keyword, offset, limit, queryParams);
        return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
    }
    catch (error) {
        log.error(`searchEvents:: ${error}`);
        const resultsFromFS = await getGroupSearchResultsFromFS(keyword, offset, limit);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
}
exports.searchGroups = searchGroups;
//# sourceMappingURL=group.search.service.js.map