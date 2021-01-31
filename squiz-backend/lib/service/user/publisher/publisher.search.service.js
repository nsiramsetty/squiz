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
exports.searchPublishers = exports.getPublisherSearchResultsFromES = exports.getPublisherSearchResultsFromFS = exports.getPublisherESQueryForRegularSearch = exports.getRelationsList = exports.getFriendsFollowingsESQueryForRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const user_model_1 = require("../../../model/user/user.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
const http_400_error_1 = __importDefault(require("../../../shared/http/http-400-error"));
// import logger from '../../../shared/logger';
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const elastic_service_1 = require("../../shared/elastic.service");
const firestore_service_1 = require("../../shared/firestore.service");
const transform_service_1 = __importDefault(require("../../shared/transform.service"));
// const log = logger(path.relative(process.cwd(), __filename));
function getFriendsFollowingsESQueryForRegularSearch(offset, limit, friendList) {
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(builder.matchQuery('followings', friendList.toString())))
        .scoreMode('sum')
        .boostMode('sum'))
        .source(['id', 'followings'])
        .from(offset)
        .size(limit);
}
exports.getFriendsFollowingsESQueryForRegularSearch = getFriendsFollowingsESQueryForRegularSearch;
async function getRelationsList(userID, offset, limit) {
    var _a;
    const userRelationFromES = (await elastic_service_1.getDocumentByIDFromES(userID, enum_1.ESIndex.USER_RELATION));
    const followings = ((_a = userRelationFromES.followings) === null || _a === void 0 ? void 0 : _a.slice(offset, limit)) || [];
    const friends = userRelationFromES.friends || [];
    const resultsFromES = await elastic_service_1.getDocumentsByIDListFromES(friends, enum_1.ESIndex.USER_RELATION, ['followings']);
    const followingFriendsMap = new Map();
    resultsFromES.items.forEach((e) => {
        followingFriendsMap.set(e.id, e.followings);
    });
    return { followings, followingFriendsMap };
}
exports.getRelationsList = getRelationsList;
function getPublisherESQueryForRegularSearch(keyword, offset, limit, userId, followingsList) {
    const fields = ['name', 'description'];
    const scoreFunctions = [
        builder.fieldValueFactorFunction('publisher_follower_count').factor(0.0009).modifier('sqrt').missing(0),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(0).type('most_fields'))
            .weight(10),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('most_fields'))
            .weight(5),
        builder
            .weightScoreFunction()
            .filter(builder.boolQuery().mustNot(builder.existsQuery('avatar')))
            .weight(-5),
    ];
    if (userId) {
        scoreFunctions.push(builder.weightScoreFunction().filter(builder.multiMatchQuery('id', userId)).weight(9));
        if (followingsList) {
            scoreFunctions.push(builder.weightScoreFunction().filter(builder.matchQuery('id', followingsList.toString())).weight(75));
        }
    }
    return builder
        .requestBodySearch()
        .query(builder
        .functionScoreQuery()
        .query(builder
        .boolQuery()
        .must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('most_fields'))
        .must(builder.termQuery('is_publisher', true)))
        .scoreMode('sum')
        .functions(scoreFunctions)
        .boostMode('sum'))
        .source(user_model_1.USER_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getPublisherESQueryForRegularSearch = getPublisherESQueryForRegularSearch;
async function getPublisherSearchResultsFromFS(keyword, offset, limit) {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'name',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    conditionsForSearch.push({
        fieldPath: 'is_publisher',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: true,
    });
    const fieldMasks = user_model_1.USER_SUMMARY_FIELDS;
    const conditionsForSort = [];
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.USERS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
exports.getPublisherSearchResultsFromFS = getPublisherSearchResultsFromFS;
async function getPublisherSearchResultsFromES(keyword, offset, limit, userID) {
    let followings = [];
    let friendsFollowing = new Map();
    if (userID) {
        const relations = await getRelationsList(userID, offset, limit);
        followings = relations.followings;
        friendsFollowing = relations.followingFriendsMap;
    }
    const esQuery = getPublisherESQueryForRegularSearch(keyword, offset, limit, userID, followings);
    const results = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.USER, esQuery);
    results.items.forEach((user) => {
        if (followings.indexOf(user.id) > -1) {
            Object.assign(user, { is_following: true });
        }
        const friendsFollowings = [];
        friendsFollowing.forEach((value, key) => {
            if (value && value.indexOf(user.id) > -1) {
                friendsFollowings.push(key);
            }
        });
        if (friendsFollowings.length) {
            Object.assign(user, { friends_who_are_following: friendsFollowings });
        }
    });
    return { total: results.total, items: results.items };
}
exports.getPublisherSearchResultsFromES = getPublisherSearchResultsFromES;
async function searchPublishers(queryParams) {
    var _a, _b;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`SearchPublishers :: query :: is Required for Publishers Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const userID = (_b = queryParams.user_id) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const resultsFromES = await getPublisherSearchResultsFromES(keyword, offset, limit, userID);
    if (resultsFromES.total === 0) {
        const resultsFromFS = await getPublisherSearchResultsFromFS(keyword, offset, limit);
        return {
            total: resultsFromFS.total,
            items: transform_service_1.default(resultsFromFS.items),
        };
    }
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.searchPublishers = searchPublishers;
//# sourceMappingURL=publisher.search.service.js.map