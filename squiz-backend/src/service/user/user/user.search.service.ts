import * as builder from 'elastic-builder';
import path from 'path';
import { ParsedQs } from 'qs';
import MySqlService from '../../../config/utils/mysql.service';
import { ESClient, ESDefaultClient } from '../../../helper/axios.helper';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../../model/response/search-result.model';
import { ESSearchHITResponse, ESSearchTransformResponse } from '../../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../../model/shared/firestore.model';
import {
  UserRelationMutualFriendsResponse,
  UserRelationMySql,
  UserRelationResponse,
  USER_SUMMARY_FIELDS,
  USER_SUMMARY_TOP_VIEW_FIELDS,
} from '../../../model/user/user.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { Collection, ESIndex, FSWhereOperator } from '../../../shared/enum';
import logger from '../../../shared/logger';
import { booleanOrDefault, numberOrDefault } from '../../../utils/query-parameter-parser';
import {
  getDocumentByIDFromES,
  getDocumentsByIDListFromES,
  getSingleIndexResultsFromES,
} from '../../shared/elastic.service';
import { getFirestoreDocuments } from '../../shared/firestore.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';

const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForUsersRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
  excludePublishers: boolean,
  userID?: string,
  userIds?: string[],
): builder.RequestBodySearch {
  const matchFields = ['name', 'username'];

  const scoreFunctions = [
    builder
      .weightScoreFunction()
      .filter(builder.boolQuery().mustNot(builder.existsQuery('avatar')))
      .weight(-5),
    builder.fieldValueFactorFunction('number_of_friends').factor(0.02).modifier('sqrt').missing(0),
  ];

  const queries: builder.Query[] = [];

  if (userID) {
    scoreFunctions.push(builder.weightScoreFunction().filter(builder.multiMatchQuery(matchFields, keyword)).weight(20));
    scoreFunctions.push(builder.weightScoreFunction().filter(builder.termsQuery('_id', userIds)).weight(100));
  }
  queries.push(
    builder.boolQuery().must(keyword ? builder.multiMatchQuery(matchFields, keyword) : builder.matchAllQuery()),
  );
  if (excludePublishers) {
    queries.push(builder.boolQuery().mustNot(builder.termQuery('is_publisher', true)));
  } else {
    scoreFunctions.push(builder.weightScoreFunction().filter(builder.termQuery('is_publisher', true)).weight(10));
    scoreFunctions.push(
      builder.fieldValueFactorFunction('publisher_follower_count').factor(0.0002).modifier('sqrt').missing(0),
    );
  }
  const mainQuery = builder.boolQuery().must(queries);
  return builder
    .requestBodySearch()
    .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
    .source(USER_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export function getESQueryForFriendsOfFriends(friendsList: string[]): builder.RequestBodySearch {
  return builder.requestBodySearch().query(
    builder
      .functionScoreQuery()
      .query(
        builder.boolQuery().must(builder.matchQuery('id', friendsList.toString())),
        // .mustNot(builder.matchQuery('friends', friendsList.toString())),
      )
      .scoreMode('sum')
      .boostMode('sum'),
  );
  // .size(50)
  // .from(0)
  // .source('')
}

export function getESQueryForUsersTopViewSearch(
  keyword: string,
  offset: number,
  limit: number,
  excludePublishers: boolean,
  userID: string,
): builder.RequestBodySearch {
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
      .weight(-5), // when a user's name is sleep, it is not likely real
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
    .source(USER_SUMMARY_TOP_VIEW_FIELDS)
    .from(offset)
    .size(limit);
}

export function getUserSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
  excludePublishers?: boolean,
): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'name',
    opStr: FSWhereOperator.EQUAL_TO,
    value: keyword,
  });
  if (excludePublishers) {
    conditionsForSearch.push({
      fieldPath: 'is_publisher',
      opStr: FSWhereOperator.EQUAL_TO,
      value: false,
    });
  }
  const conditionsForSort: FSSortCondition[] = [];
  return getFirestoreDocuments(
    Collection.USERS,
    conditionsForSearch,
    conditionsForSort,
    offset,
    limit,
    USER_SUMMARY_FIELDS,
  );
}

export async function getRelationsList(
  userID: string,
  friends: string[],
  esClient?: ESClient,
): Promise<{ friends: string[]; friendsOfFriends: string[]; mutualFriendList: Map<string, string[] | undefined> }> {
  return (esClient || ESDefaultClient)
    .post(`${ESIndex.USER_RELATION}/_search`, {
      size: 10000,
      query: {
        terms: {
          _id: {
            index: ESIndex.USER_RELATION,
            type: '_doc',
            id: userID,
            path: 'friends',
          },
        },
      },
      _source: ['friends'],
    })
    .then((data): {
      friends: string[];
      friendsOfFriends: string[];
      mutualFriendList: Map<string, string[] | undefined>;
    } => {
      const friendsOfFriends: string[] = [];
      const mutualFriendList: Map<string, string[] | undefined> = new Map();
      data.data.hits.hits.forEach((hit: ESSearchHITResponse): void => {
        hit._source.friends?.forEach((friend): void => {
          if (friendsOfFriends.findIndex((user): boolean => user === friend) < 0) {
            friendsOfFriends.push(friend);
          }
          if (friends.findIndex((user): boolean => user === friend) < 0) {
            if (mutualFriendList.get(friend)) {
              const existingList: string[] | undefined = mutualFriendList.get(friend);
              existingList?.push(hit._id);
              mutualFriendList.set(friend, existingList);
            } else {
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
    .catch((): {
      friends: string[];
      friendsOfFriends: string[];
      mutualFriendList: Map<string, string[] | undefined>;
    } => {
      return {
        friends: [],
        friendsOfFriends: [],
        mutualFriendList: new Map(),
      };
    });
}

export async function getUserFriendsMysql(
  keyword: string,
  userId: string,
  offset: number,
  limit: number,
): Promise<UserRelationMySql[]> {
  return new Promise((resolve, rejects): void => {
    const sql = ` select other_user_id as user_id, name , 'self' as friend_id, 'self' as friend_name
                  from user_user_relation 
                  where user_id=?
                  and is_friend=true and is_publisher = false and is_friend = true
                  and (lower(name) like lower(?) or lower(username) like lower(?)) limit ?,? `;
    const connectionPool = MySqlService.getConnectionPool();
    connectionPool.query(sql, [userId, `%${keyword}%`, `%${keyword}%`, offset, limit], (err, result): void => {
      if (err) {
        rejects(err.message);
      } else {
        resolve(result);
      }
    });
  });
}

export async function getUserFriendsOfFriendsMysql(
  keyword: string,
  userId: string,
  offset: number,
  limit: number,
): Promise<UserRelationMySql[]> {
  return new Promise((resolve, rejects): void => {
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
    const connectionPool = MySqlService.getConnectionPool();
    connectionPool.query(sql, [userId, `%${keyword}%`, `%${keyword}%`, userId, offset, limit], (err, result): void => {
      if (err) {
        rejects(err.message);
      } else {
        resolve(result);
      }
    });
  });
}

export async function getUserRelationsSearchMysql(
  keyword: string,
  userId: string,
  offset: number,
  limit: number,
): Promise<UserRelationMySql[]> {
  const promises: UserRelationMySql[] = [];
  promises.push(...(await getUserFriendsMysql(keyword, userId, offset, limit)));
  promises.push(...(await getUserFriendsOfFriendsMysql(keyword, userId, offset, limit)));
  return Promise.resolve(promises);
}

export async function getRelationsListV2(userID: string): Promise<UserRelationMutualFriendsResponse> {
  const userRelationFromES = (await getDocumentByIDFromES(userID, ESIndex.USER_RELATION)) as UserRelationResponse;
  const friendListFromES = userRelationFromES.friends || [];
  const resultsFromES = await getDocumentsByIDListFromES(friendListFromES, ESIndex.USER_RELATION, ['friends']);
  const friendsOfFriends: string[] = [];
  const mutualFriendMap: Map<string, string[] | undefined> = new Map();
  resultsFromES.items.forEach((e: UserRelationResponse): void => {
    e.friends?.forEach((friendOfFriend: string): void => {
      if (friendListFromES.findIndex((friend): boolean => friend === friendOfFriend) < 0) {
        if (mutualFriendMap.get(friendOfFriend)) {
          const existingList: string[] | undefined = mutualFriendMap.get(friendOfFriend);
          existingList?.push(e.id);
          mutualFriendMap.set(friendOfFriend, existingList);
        } else {
          const existingList = [e.id];
          mutualFriendMap.set(friendOfFriend, existingList);
        }
      } else if (
        friendListFromES.findIndex((user): boolean => user === friendOfFriend) < 0 &&
        friendsOfFriends.findIndex((user): boolean => user === friendOfFriend) < 0
      ) {
        friendsOfFriends.push(friendOfFriend);
      }
    });
  });
  return { friends: friendListFromES, friendsOfFriends, mutualFriends: mutualFriendMap };
}

export async function getFriends(userID: string): Promise<UserRelationMutualFriendsResponse> {
  const userRelationFromES = (await getDocumentByIDFromES(userID, ESIndex.USER_RELATION)) as UserRelationResponse;
  const friendListFromES = userRelationFromES.friends || [];
  const friendsOfFriends: string[] = [];
  const mutualFriendMap: Map<string, string[] | undefined> = new Map();
  return { friends: friendListFromES, friendsOfFriends, mutualFriends: mutualFriendMap };
}

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

export async function getUserSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
  excludePublishers: boolean,
  userID?: string,
): Promise<ESSearchTransformResponse> {
  // const friendsOfFriends: string[] = [];
  // const friends: string[] = [];
  let userIds: string[] = [];
  let relations: UserRelationMySql[] = [];
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
    userIds = relations.map((userRelation): string => userRelation.user_id);
  }

  const esQuery = getESQueryForUsersRegularSearch(keyword, offset, limit, excludePublishers, userID, userIds);
  log.debug(JSON.stringify(esQuery));
  const results = await getSingleIndexResultsFromES(ESIndex.USER, esQuery);
  if (userID) {
    results.items.forEach((user): void => {
      const userFound = relations.find((relation): boolean => relation.user_id === user.id);
      if (userFound) {
        if (userFound.friend_id === 'self') {
          Object.assign(user, { is_friend: true });
        } else {
          Object.assign(user, { is_friend_of_friend: true });
          Object.assign(user, { mutual_friends: [{ id: userFound.friend_id, name: userFound.friend_name }] });
        }
      }
    });
  }
  return { total: results.total, items: results.items };
}

export default async function searchUsers(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const excludePublishers = booleanOrDefault(queryParams.exclude_publishers, false);
  const userID: string | undefined = queryParams.user_id?.toString();
  const resultsFromES = await getUserSearchResultsFromES(keyword, offset, limit, excludePublishers, userID);
  if (resultsFromES.total === 0) {
    const resultsFromFS = await getUserSearchResultsFromFS(keyword, offset, limit, excludePublishers);
    return { total: resultsFromFS.total, items: transformToUnifiedSearchResults(resultsFromFS.items) };
  }
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
