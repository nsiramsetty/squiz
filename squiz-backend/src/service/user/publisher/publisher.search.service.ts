import * as builder from 'elastic-builder';
// import path from 'path';
import { ParsedQs } from 'qs';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../../model/shared/firestore.model';
import {
  PublisherRelationMutualFriendsResponse,
  UserRelationResponse,
  USER_SUMMARY_FIELDS,
} from '../../../model/user/user.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { Collection, ESIndex, FSWhereOperator } from '../../../shared/enum';
import HTTP400Error from '../../../shared/http/http-400-error';
// import logger from '../../../shared/logger';
import { numberOrDefault } from '../../../utils/query-parameter-parser';
import {
  getDocumentByIDFromES,
  getDocumentsByIDListFromES,
  getSingleIndexResultsFromES,
} from '../../shared/elastic.service';
import { getFirestoreDocuments } from '../../shared/firestore.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getFriendsFollowingsESQueryForRegularSearch(
  offset: number,
  limit: number,
  friendList: string[],
): builder.RequestBodySearch {
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(builder.matchQuery('followings', friendList.toString())))
        .scoreMode('sum')
        .boostMode('sum'),
    )
    .source(['id', 'followings'])
    .from(offset)
    .size(limit);
}

export async function getRelationsList(
  userID: string,
  offset: number,
  limit: number,
): Promise<PublisherRelationMutualFriendsResponse> {
  const userRelationFromES = (await getDocumentByIDFromES(userID, ESIndex.USER_RELATION)) as UserRelationResponse;
  const followings: string[] = userRelationFromES.followings?.slice(offset, limit) || [];
  const friends: string[] = userRelationFromES.friends || [];
  const resultsFromES = await getDocumentsByIDListFromES(friends, ESIndex.USER_RELATION, ['followings']);
  const followingFriendsMap: Map<string, string[] | undefined> = new Map();
  resultsFromES.items.forEach((e): void => {
    followingFriendsMap.set(e.id, e.followings);
  });
  return { followings, followingFriendsMap };
}

export function getPublisherESQueryForRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
  userId: string,
  followingsList?: string[],
): builder.RequestBodySearch {
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
      scoreFunctions.push(
        builder.weightScoreFunction().filter(builder.matchQuery('id', followingsList.toString())).weight(75),
      );
    }
  }
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(
          builder
            .boolQuery()
            .must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('most_fields'))
            .must(builder.termQuery('is_publisher', true)),
        )
        .scoreMode('sum')
        .functions(scoreFunctions)
        .boostMode('sum'),
    )
    .source(USER_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export async function getPublisherSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'name',
    opStr: FSWhereOperator.EQUAL_TO,
    value: keyword,
  });
  conditionsForSearch.push({
    fieldPath: 'is_publisher',
    opStr: FSWhereOperator.EQUAL_TO,
    value: true,
  });
  const fieldMasks: string[] = USER_SUMMARY_FIELDS;
  const conditionsForSort: FSSortCondition[] = [];
  return getFirestoreDocuments(Collection.USERS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export async function getPublisherSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
  userID: string,
): Promise<ESSearchTransformResponse> {
  let followings: string[] = [];
  let friendsFollowing: Map<string, string[] | undefined> = new Map();
  if (userID) {
    const relations = await getRelationsList(userID, offset, limit);
    followings = relations.followings;
    friendsFollowing = relations.followingFriendsMap;
  }
  const esQuery = getPublisherESQueryForRegularSearch(keyword, offset, limit, userID, followings);
  const results = await getSingleIndexResultsFromES(ESIndex.USER, esQuery);
  results.items.forEach((user): void => {
    if (followings.indexOf(user.id) > -1) {
      Object.assign(user, { is_following: true });
    }
    const friendsFollowings: string[] = [];
    friendsFollowing.forEach((value: string[] | undefined, key: string): void => {
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

export async function searchPublishers(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`SearchPublishers :: query :: is Required for Publishers Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const userID: string | undefined = queryParams.user_id?.toString().trim();
  const resultsFromES = await getPublisherSearchResultsFromES(keyword, offset, limit, userID);
  if (resultsFromES.total === 0) {
    const resultsFromFS = await getPublisherSearchResultsFromFS(keyword, offset, limit);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
