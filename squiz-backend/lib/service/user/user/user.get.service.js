"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFollowers = exports.getUserFriends = exports.getUserFollowings = exports.getUserGroups = exports.getUserCourses = exports.getUser = exports.getESQueryForFriendsGroup = void 0;
const path_1 = __importDefault(require("path"));
const axios_helper_1 = require("../../../helper/axios.helper");
const group_model_1 = require("../../../model/group/group.model");
const user_model_1 = require("../../../model/user/user.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
const logger_1 = __importDefault(require("../../../shared/logger"));
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const elastic_service_1 = require("../../shared/elastic.service");
const firestore_service_1 = require("../../shared/firestore.service");
const publisher_get_service_1 = require("../publisher/publisher.get.service");
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function getESQueryForFriendsGroup(friendsList) {
    return axios_helper_1.ESDefaultClient.post(`${enum_1.ESIndex.USER_RELATION}/_doc/_mget`, { ids: friendsList })
        .then((response) => {
        const friendList = new Map();
        response.data.docs.forEach((hit) => {
            var _a;
            (_a = hit._source.groups) === null || _a === void 0 ? void 0 : _a.forEach((group) => {
                if (friendList.get(group)) {
                    const existingList = friendList.get(group);
                    existingList === null || existingList === void 0 ? void 0 : existingList.push(hit._id);
                    friendList.set(group, existingList);
                }
                else {
                    const existingList = [hit._id];
                    friendList.set(group, existingList);
                }
            });
        });
        return friendList;
    })
        .catch((error) => {
        log.error(`ES Search Error => ${error.stack}.`);
        return new Map();
    });
}
exports.getESQueryForFriendsGroup = getESQueryForFriendsGroup;
async function getUser(id) {
    return elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.USER, axios_helper_1.ESDefaultClient, user_model_1.USER_SUMMARY_FIELDS).catch(async () => {
        return firestore_service_1.getFirestoreDocById(enum_1.Collection.USERS, id, user_model_1.USER_SUMMARY_FIELDS);
    });
}
exports.getUser = getUser;
async function getUserCourses(id) {
    return publisher_get_service_1.getPublisherCourses(id);
}
exports.getUserCourses = getUserCourses;
async function getUserGroups(id, queryParams) {
    var _a, _b, _c;
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const userRelationFromES = (await elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.USER_RELATION));
    const groupListFromES = ((_a = userRelationFromES.groups) === null || _a === void 0 ? void 0 : _a.slice(offset, limit)) || [];
    const friendListFromES = ((_b = userRelationFromES.friends) === null || _b === void 0 ? void 0 : _b.slice(offset, limit)) || [];
    const resultsFromES = await elastic_service_1.getDocumentsByIDListFromES(groupListFromES, enum_1.ESIndex.GROUP, group_model_1.GROUP_SUMMARY_FIELDS);
    if (resultsFromES.total === 0) {
        const conditionsForSearch = [];
        const conditionsForSort = [];
        conditionsForSort.push({
            fieldPath: 'joined_at.epoch',
            directionStr: 'desc',
        });
        const fieldMasks = group_model_1.GROUP_RELATION_SUMMARY_FIELDS;
        const resultsFromFS = await firestore_service_1.getFirestoreDocuments(`${enum_1.Collection.USERS}/${id}/group_relation`, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks, enum_1.SearchResultType.GROUPS);
        return { total: resultsFromFS.total, items: resultsFromFS.items };
    }
    const friendsGroupFromES = await getESQueryForFriendsGroup(friendListFromES);
    resultsFromES.items.forEach((e) => {
        if (friendsGroupFromES.get(e.id)) {
            Object.assign(e, { friends: friendsGroupFromES.get(e.id) });
        }
    });
    return { total: ((_c = userRelationFromES === null || userRelationFromES === void 0 ? void 0 : userRelationFromES.groups) === null || _c === void 0 ? void 0 : _c.length) || 0, items: resultsFromES.items };
}
exports.getUserGroups = getUserGroups;
async function getUserFollowings(id, queryParams) {
    var _a, _b;
    const userRelationFromES = (await elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.USER_RELATION, axios_helper_1.ESDefaultClient));
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const followingsListFromES = ((_a = userRelationFromES.followings) === null || _a === void 0 ? void 0 : _a.slice(offset, limit)) || [];
    const resultsFromES = await elastic_service_1.getDocumentsByIDListFromES(followingsListFromES, enum_1.ESIndex.USER, user_model_1.USER_SUMMARY_FIELDS);
    if (resultsFromES.total === 0) {
        let conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'is_following',
            opStr: '==',
            value: true,
        });
        let conditionsForSort = [];
        const fieldMasks = user_model_1.USER_RELATION_SUMMARY_FIELDS;
        const userRelationFromFS = await firestore_service_1.getFirestoreDocuments(`/${enum_1.Collection.USERS}/${id}/user_relation`, conditionsForSearch, conditionsForSort, offset, constants_1.FS_IN_QUERY_LIMIT, fieldMasks, enum_1.SearchResultType.USER_RELATION);
        const followingsListFromFS = userRelationFromFS.items.map((item) => item.id);
        conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'id',
            opStr: enum_1.FSWhereOperator.IN,
            value: followingsListFromFS,
        });
        conditionsForSort = [];
        return firestore_service_1.getFirestoreDocuments(enum_1.Collection.USERS, conditionsForSearch, conditionsForSort, offset, limit, user_model_1.USER_SUMMARY_FIELDS);
    }
    return { total: ((_b = userRelationFromES === null || userRelationFromES === void 0 ? void 0 : userRelationFromES.followings) === null || _b === void 0 ? void 0 : _b.length) || 0, items: resultsFromES.items };
}
exports.getUserFollowings = getUserFollowings;
async function getUserFriends(id, queryParams) {
    var _a, _b;
    const userRelationFromES = (await elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.USER_RELATION));
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const friendsListFromES = ((_a = userRelationFromES.friends) === null || _a === void 0 ? void 0 : _a.slice(offset, limit)) || [];
    const resultsFromES = await elastic_service_1.getDocumentsByIDListFromES(friendsListFromES, enum_1.ESIndex.USER, user_model_1.USER_SUMMARY_FIELDS);
    if (resultsFromES.total === 0) {
        let conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'is_friend',
            opStr: '==',
            value: true,
        });
        let conditionsForSort = [];
        const fieldMasks = user_model_1.USER_RELATION_SUMMARY_FIELDS;
        const userRelationFromFS = await firestore_service_1.getFirestoreDocuments(`/${enum_1.Collection.USERS}/${id}/user_relation`, conditionsForSearch, conditionsForSort, offset, constants_1.FS_IN_QUERY_LIMIT, fieldMasks, enum_1.SearchResultType.USER_RELATION);
        const friendsListFromFS = userRelationFromFS.items.map((item) => item.id);
        conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'id',
            opStr: enum_1.FSWhereOperator.IN,
            value: friendsListFromFS,
        });
        conditionsForSort = [];
        return firestore_service_1.getFirestoreDocuments(enum_1.Collection.USERS, conditionsForSearch, conditionsForSort, offset, limit, user_model_1.USER_SUMMARY_FIELDS);
    }
    return { total: ((_b = userRelationFromES === null || userRelationFromES === void 0 ? void 0 : userRelationFromES.friends) === null || _b === void 0 ? void 0 : _b.length) || 0, items: resultsFromES.items };
}
exports.getUserFriends = getUserFriends;
async function getUserFollowers(id, queryParams) {
    var _a, _b;
    const userRelationFromES = (await elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.USER_RELATION));
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const followersListFromES = ((_a = userRelationFromES.followers) === null || _a === void 0 ? void 0 : _a.slice(offset, limit)) || [];
    const resultsFromES = await elastic_service_1.getDocumentsByIDListFromES(followersListFromES, enum_1.ESIndex.USER, user_model_1.USER_SUMMARY_FIELDS);
    if (resultsFromES.total === 0) {
        let conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'is_followed_by',
            opStr: '==',
            value: true,
        });
        let conditionsForSort = [];
        const userRelationFromFS = await firestore_service_1.getFirestoreDocuments(`/${enum_1.Collection.USERS}/${id}/user_relation`, conditionsForSearch, conditionsForSort, offset, constants_1.FS_IN_QUERY_LIMIT, user_model_1.USER_RELATION_SUMMARY_FIELDS, enum_1.SearchResultType.USER_RELATION);
        const followersListFromFS = userRelationFromFS.items.map((item) => item.id);
        conditionsForSearch = [];
        conditionsForSearch.push({
            fieldPath: 'id',
            opStr: enum_1.FSWhereOperator.IN,
            value: followersListFromFS,
        });
        conditionsForSort = [];
        return firestore_service_1.getFirestoreDocuments(enum_1.Collection.USERS, conditionsForSearch, conditionsForSort, offset, limit, user_model_1.USER_SUMMARY_FIELDS);
    }
    return { total: ((_b = userRelationFromES === null || userRelationFromES === void 0 ? void 0 : userRelationFromES.followers) === null || _b === void 0 ? void 0 : _b.length) || 0, items: resultsFromES.items };
}
exports.getUserFollowers = getUserFollowers;
//# sourceMappingURL=user.get.service.js.map