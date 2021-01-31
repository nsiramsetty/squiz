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
exports.getUserSearchResultsFromES = exports.getFriends = exports.getRelationsListV2 = exports.getUserRelationsSearchMysql = exports.getUserFriendsOfFriendsMysql = exports.getUserFriendsMysql = exports.getRelationsList = exports.getUserSearchResultsFromFS = exports.getESQueryForUsersTopViewSearch = exports.getESQueryForFriendsOfFriends = exports.getESQueryForUsersRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const path_1 = __importDefault(require("path"));
const mysql_service_1 = __importDefault(require("../../../config/utils/mysql.service"));
const axios_helper_1 = require("../../../helper/axios.helper");
const user_model_1 = require("../../../model/user/user.model");
const constants_1 = require("../../../shared/constants");
const enum_1 = require("../../../shared/enum");
const logger_1 = __importDefault(require("../../../shared/logger"));
const query_parameter_parser_1 = require("../../../utils/query-parameter-parser");
const elastic_service_1 = require("../../shared/elastic.service");
const firestore_service_1 = require("../../shared/firestore.service");
const transform_service_1 = __importDefault(require("../../shared/transform.service"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function getESQueryForUsersRegularSearch(keyword, offset, limit, excludePublishers, userID, userIds) {
    const matchFields = ['name', 'username'];
    const scoreFunctions = [
        builder
            .weightScoreFunction()
            .filter(builder.boolQuery().mustNot(builder.existsQuery('avatar')))
            .weight(-5),
        builder.fieldValueFactorFunction('number_of_friends').factor(0.02).modifier('sqrt').missing(0),
    ];
    const queries = [];
    if (userID) {
        scoreFunctions.push(builder.weightScoreFunction().filter(builder.multiMatchQuery(matchFields, keyword)).weight(20));
        scoreFunctions.push(builder.weightScoreFunction().filter(builder.termsQuery('_id', userIds)).weight(100));
        // queries.push(
        //   builder
        //     .boolQuery()
        //     .should([
        //       builder.boolQuery().filter(builder.termsQuery('_id', userIds)),
        //       builder.boolQuery().must(keyword ? builder.multiMatchQuery(matchFields, keyword) : builder.matchAllQuery()),
        //     ])
        //     .minimumShouldMatch(1),
        // );
    }
    queries.push(builder.boolQuery().must(keyword ? builder.multiMatchQuery(matchFields, keyword) : builder.matchAllQuery()));
    if (excludePublishers) {
        queries.push(builder.boolQuery().mustNot(builder.termQuery('is_publisher', true)));
    }
    else {
        scoreFunctions.push(builder.weightScoreFunction().filter(builder.termQuery('is_publisher', true)).weight(10));
        scoreFunctions.push(builder.fieldValueFactorFunction('publisher_follower_count').factor(0.0002).modifier('sqrt').missing(0));
    }
    const mainQuery = builder.boolQuery().must(queries);
    return builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
        .source(user_model_1.USER_SUMMARY_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForUsersRegularSearch = getESQueryForUsersRegularSearch;
function getESQueryForFriendsOfFriends(friendsList) {
    return builder.requestBodySearch().query(builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(builder.matchQuery('id', friendsList.toString())))
        .scoreMode('sum')
        .boostMode('sum'));
    // .size(50)
    // .from(0)
    // .source('')
}
exports.getESQueryForFriendsOfFriends = getESQueryForFriendsOfFriends;
function getESQueryForUsersTopViewSearch(keyword, offset, limit, excludePublishers, userID) {
    const scoreFunctions = [
        builder.fieldValueFactorFunction('publisher_follower_count').factor(0.003).modifier('sqrt').missing(0),
        builder.weightScoreFunction().filter(builder.termQuery('is_publisher', true)).weight(10),
        builder
            .weightScoreFunction()
            .filter(builder.boolQuery().mustNot(builder.existsQuery('avatar')))
            .weight(-5),
        builder
            .weightScoreFunction()
            .filter(builder.boolQuery().should(builder.termQuery('name.keyword', keyword)))
            .weight(20),
        builder
            .weightScoreFunction()
            .filter(builder.boolQuery().should(builder.termQuery('name', 'Sleep')))
            .weight(-5),
        builder.weightScoreFunction().filter(builder.termQuery('is_publisher', false)).weight(-25),
    ];
    if (userID) {
        scoreFunctions.push(builder.weightScoreFunction().filter(builder.multiMatchQuery('id', userID)).weight(34));
    }
    const mainQuery = builder
        .boolQuery()
        .should([
        builder.multiMatchQuery(['name^3', 'description'], keyword).fuzziness(2).type('most_fields'),
        builder.matchQuery('region.name', keyword).fuzziness(1),
    ]);
    if (excludePublishers) {
        mainQuery.filter(builder.termQuery('is_publisher', false));
    }
    return builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
        .source(user_model_1.USER_SUMMARY_TOP_VIEW_FIELDS)
        .from(offset)
        .size(limit);
}
exports.getESQueryForUsersTopViewSearch = getESQueryForUsersTopViewSearch;
function getUserSearchResultsFromFS(keyword, offset, limit, excludePublishers) {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'name',
        opStr: enum_1.FSWhereOperator.EQUAL_TO,
        value: keyword,
    });
    if (excludePublishers) {
        conditionsForSearch.push({
            fieldPath: 'is_publisher',
            opStr: enum_1.FSWhereOperator.EQUAL_TO,
            value: false,
        });
    }
    const conditionsForSort = [];
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.USERS, conditionsForSearch, conditionsForSort, offset, limit, user_model_1.USER_SUMMARY_FIELDS);
}
exports.getUserSearchResultsFromFS = getUserSearchResultsFromFS;
async function getRelationsList(userID, friends, esClient) {
    return (esClient || axios_helper_1.ESDefaultClient)
        .post(`${enum_1.ESIndex.USER_RELATION}/_search`, {
        size: 10000,
        query: {
            terms: {
                _id: {
                    index: enum_1.ESIndex.USER_RELATION,
                    type: '_doc',
                    id: userID,
                    path: 'friends',
                },
            },
        },
        _source: ['friends'],
    })
        .then((data) => {
        const friendsOfFriends = [];
        const mutualFriendList = new Map();
        data.data.hits.hits.forEach((hit) => {
            var _a;
            (_a = hit._source.friends) === null || _a === void 0 ? void 0 : _a.forEach((friend) => {
                if (friendsOfFriends.findIndex((user) => user === friend) < 0) {
                    friendsOfFriends.push(friend);
                }
                if (friends.findIndex((user) => user === friend) < 0) {
                    if (mutualFriendList.get(friend)) {
                        const existingList = mutualFriendList.get(friend);
                        existingList === null || existingList === void 0 ? void 0 : existingList.push(hit._id);
                        mutualFriendList.set(friend, existingList);
                    }
                    else {
                        const existingList = [hit._id];
                        mutualFriendList.set(friend, existingList);
                    }
                }
            });
        });
        return {
            friends,
            friendsOfFriends,
            mutualFriendList,
        };
    })
        .catch(() => {
        return {
            friends: [],
            friendsOfFriends: [],
            mutualFriendList: new Map(),
        };
    });
}
exports.getRelationsList = getRelationsList;
async function getUserFriendsMysql(keyword, userId, offset, limit) {
    return new Promise((resolve, rejects) => {
        const sql = ` select other_user_id as user_id, name , 'self' as friend_id, 'self' as friend_name
                  from user_user_relation 
                  where user_id=?
                  and is_friend=true and is_publisher = false and is_friend = true
                  and (lower(name) like lower(?) or lower(username) like lower(?)) limit ?,? `;
        const connectionPool = mysql_service_1.default.getConnectionPool();
        connectionPool.query(sql, [userId, `%${keyword}%`, `%${keyword}%`, offset, limit], (err, result) => {
            if (err) {
                rejects(err.message);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.getUserFriendsMysql = getUserFriendsMysql;
async function getUserFriendsOfFriendsMysql(keyword, userId, offset, limit) {
    return new Promise((resolve, rejects) => {
        const sql = ` select ur1.other_user_id as user_id,ur1.name,ur1.user_id as friend_id, ur2.name as friend_name,ur1.has_avatar,ur1.milestone,
                  ur1.username
                  from user_user_relation ur1 
                  inner join user_user_relation ur2 on ur2.other_user_id = ur1.user_id and ur1.is_friend = true and ur1.is_publisher = false
                      and ur1.other_user_id != ur2.user_id
                  where ur2.user_id=? and ur2.is_friend = true and ur2.is_publisher=false
                  and (lower(ur1.name) like lower(?) or lower(ur1.username) like lower(?))
                  and ur1.other_user_id not in( 
                          select other_user_id from user_user_relation where user_id=? and is_friend=true and is_publisher = false)
                          limit ?,?`;
        const connectionPool = mysql_service_1.default.getConnectionPool();
        connectionPool.query(sql, [userId, `%${keyword}%`, `%${keyword}%`, userId, offset, limit], (err, result) => {
            if (err) {
                rejects(err.message);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.getUserFriendsOfFriendsMysql = getUserFriendsOfFriendsMysql;
async function getUserRelationsSearchMysql(keyword, userId, offset, limit) {
    const promises = [];
    promises.push(...(await getUserFriendsMysql(keyword, userId, offset, limit)));
    promises.push(...(await getUserFriendsOfFriendsMysql(keyword, userId, offset, limit)));
    return Promise.resolve(promises);
}
exports.getUserRelationsSearchMysql = getUserRelationsSearchMysql;
async function getRelationsListV2(userID) {
    const userRelationFromES = (await elastic_service_1.getDocumentByIDFromES(userID, enum_1.ESIndex.USER_RELATION));
    const friendListFromES = userRelationFromES.friends || [];
    const resultsFromES = await elastic_service_1.getDocumentsByIDListFromES(friendListFromES, enum_1.ESIndex.USER_RELATION, ['friends']);
    const friendsOfFriends = [];
    const mutualFriendMap = new Map();
    resultsFromES.items.forEach((e) => {
        var _a;
        (_a = e.friends) === null || _a === void 0 ? void 0 : _a.forEach((friendOfFriend) => {
            if (friendListFromES.findIndex((friend) => friend === friendOfFriend) < 0) {
                if (mutualFriendMap.get(friendOfFriend)) {
                    const existingList = mutualFriendMap.get(friendOfFriend);
                    existingList === null || existingList === void 0 ? void 0 : existingList.push(e.id);
                    mutualFriendMap.set(friendOfFriend, existingList);
                }
                else {
                    const existingList = [e.id];
                    mutualFriendMap.set(friendOfFriend, existingList);
                }
            }
            else if (friendListFromES.findIndex((user) => user === friendOfFriend) < 0 &&
                friendsOfFriends.findIndex((user) => user === friendOfFriend) < 0) {
                friendsOfFriends.push(friendOfFriend);
            }
        });
    });
    return { friends: friendListFromES, friendsOfFriends, mutualFriends: mutualFriendMap };
}
exports.getRelationsListV2 = getRelationsListV2;
async function getFriends(userID) {
    const userRelationFromES = (await elastic_service_1.getDocumentByIDFromES(userID, enum_1.ESIndex.USER_RELATION));
    const friendListFromES = userRelationFromES.friends || [];
    const friendsOfFriends = [];
    const mutualFriendMap = new Map();
    return { friends: friendListFromES, friendsOfFriends, mutualFriends: mutualFriendMap };
}
exports.getFriends = getFriends;
// function getMutualFriends(friends: string[], relations: UserRelationMySql[]): UserRelationMutualFriendsResponse {
//   const mutualFriendList: Map<string, string[] | undefined> = new Map();
//   const friendOfFriends: string[] = [];
//   // const fofMap: Map<string, string[] | undefined> = new Map();
//   // relations.forEach((relation): void => {
//   //   const keyName = relation.user_id?.toString() || '';
//   //   if (fofMap.get(keyName)) {
//   //     const existingList: string[] | undefined = fofMap.get(keyName);
//   //     existingList?.push(relation.other_user_id ? relation.other_user_id.toString() : '');
//   //     fofMap.set(keyName, existingList);
//   //   } else {
//   //     const existingList = [relation.other_user_id ? relation.other_user_id.toString() : ''];
//   //     fofMap.set(keyName, existingList);
//   //   }
//   // });
//   relations.forEach((relation: UserRelationMySql): void => {
//     const keyName = relation.other_user_id;
//     if (friendOfFriends.findIndex((fr): boolean => fr === keyName) < 0) {
//       friendOfFriends.push(keyName);
//     }
//     if (friends.findIndex((user): boolean => user === keyName) < 0) {
//       if (mutualFriendList.get(keyName)) {
//         const existingList: string[] | undefined = mutualFriendList.get(keyName);
//         existingList?.push(relation.user_id);
//         mutualFriendList.set(keyName, existingList);
//       } else {
//         const existingList = [relation.user_id];
//         mutualFriendList.set(keyName, existingList);
//       }
//     }
//   });
//   // fofMap.forEach((value: string[] | undefined, key: string): void => {
//   //   value?.forEach((friend): void => {
//   //     if (friends.findIndex((user): boolean => user === friend) < 0) {
//   //       if (mutualFriendList.get(friend)) {
//   //         const existingList: string[] | undefined = mutualFriendList.get(friend);
//   //         existingList?.push(key);
//   //         mutualFriendList.set(friend, existingList);
//   //       } else {
//   //         const existingList = [key];
//   //         mutualFriendList.set(friend, existingList);
//   //       }
//   //     }
//   //   });
//   // });
//   return { friendsOfFriends: friendOfFriends, mutualFriends: mutualFriendList, friends };
// }
// async function getUserRelations(userIds: string[]): Promise<UserRelationMySql[]> {
//   const relations: UserRelationMySql[] = [];
//   const mysqlLimit = 1000;
//   if (userIds.length > mysqlLimit) {
//     let flag = true;
//     let i = 0;
//     while (flag) {
//       if (i % mysqlLimit === 0) {
//         // eslint-disable-next-line no-await-in-loop
//         relations.push(...(await getUserRelationsMysql(userIds.splice(0, mysqlLimit))));
//       }
//       if (userIds.length < mysqlLimit) {
//         const remainingItem = userIds.splice(0, mysqlLimit);
//         if (!remainingItem.length) {
//           flag = false;
//           break;
//         }
//         // eslint-disable-next-line no-await-in-loop
//         relations.push(...(await getUserRelationsMysql(remainingItem)));
//       }
//       i += 1;
//     }
//   } else {
//     relations.push(...(await getUserRelationsMysql(userIds)));
//   }
//   return relations;
// }
async function getUserSearchResultsFromES(keyword, offset, limit, excludePublishers, userID) {
    // const friendsOfFriends: string[] = [];
    // const friends: string[] = [];
    let userIds = [];
    let relations = [];
    // const mutualFriends: Map<string, string[] | undefined> = new Map();
    if (userID) {
        // const friendsArray = await getUserFriendsMysql(userID);
        // // friends = friendsArray.map((friend): string => friend.other_user_id);
        // friends = (await getFriends(userID)).friends;
        // log.info(`Friends found :: ${friends.length}`);
        // const relations = await getUserRelations(friends);
        // log.info(`Relations found :: ${relations.length}`);
        // const res = getMutualFriends(friends, relations);
        // mutualFriends = res.mutualFriends;
        // friendsOfFriends = res.friendsOfFriends;
        // log.info(`Friends of Friends found :: ${friendsOfFriends.length}`);
        // friends = relations.friends;
        // friendsOfFriends = relations.friendsOfFriends;
        // mutualFriends = relations.mutualFriendList;
        relations = await getUserRelationsSearchMysql(keyword, userID, offset, limit);
        userIds = relations.map((userRelation) => userRelation.user_id);
    }
    const esQuery = getESQueryForUsersRegularSearch(keyword, offset, limit, excludePublishers, userID, userIds);
    log.debug(JSON.stringify(esQuery));
    const results = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.USER, esQuery);
    if (userID) {
        results.items.forEach((user) => {
            const userFound = relations.find((relation) => relation.user_id === user.id);
            if (userFound) {
                if (userFound.friend_id === 'self') {
                    Object.assign(user, { is_friend: true });
                }
                else {
                    Object.assign(user, { is_friend_of_friend: true });
                    Object.assign(user, { mutual_friends: [{ id: userFound.friend_id, name: userFound.friend_name }] });
                }
            }
        });
    }
    return { total: results.total, items: results.items };
}
exports.getUserSearchResultsFromES = getUserSearchResultsFromES;
async function searchUsers(queryParams) {
    var _a, _b;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const excludePublishers = query_parameter_parser_1.booleanOrDefault(queryParams.exclude_publishers, false);
    const userID = (_b = queryParams.user_id) === null || _b === void 0 ? void 0 : _b.toString();
    const resultsFromES = await getUserSearchResultsFromES(keyword, offset, limit, excludePublishers, userID);
    if (resultsFromES.total === 0) {
        const resultsFromFS = await getUserSearchResultsFromFS(keyword, offset, limit, excludePublishers);
        return { total: resultsFromFS.total, items: transform_service_1.default(resultsFromFS.items) };
    }
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.default = searchUsers;
//# sourceMappingURL=user.search.service.js.map