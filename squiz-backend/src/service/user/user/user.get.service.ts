import path from 'path';
import { ParsedQs } from 'qs';
import { ESDefaultClient } from '../../../helper/axios.helper';
import { GROUP_RELATION_SUMMARY_FIELDS, GROUP_SUMMARY_FIELDS } from '../../../model/group/group.model';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { SearchResultResponse } from '../../../model/response/search-result.model';
import { ESSearchHITResponse } from '../../../model/shared/elastic.model';
import { FSSearchCondition, FSSortCondition } from '../../../model/shared/firestore.model';
import {
  UserRelationResponse,
  USER_RELATION_SUMMARY_FIELDS,
  USER_SUMMARY_FIELDS,
} from '../../../model/user/user.model';
import { DEFAULT_PAGE_SIZE, FS_IN_QUERY_LIMIT } from '../../../shared/constants';
import { Collection, ESIndex, FSWhereOperator, SearchResultType } from '../../../shared/enum';
import logger from '../../../shared/logger';
import { numberOrDefault } from '../../../utils/query-parameter-parser';
import { getDocumentByIDFromES, getDocumentsByIDListFromES } from '../../shared/elastic.service';
import { getFirestoreDocById, getFirestoreDocuments } from '../../shared/firestore.service';
import { getPublisherCourses } from '../publisher/publisher.get.service';

const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForFriendsGroup(friendsList: string[]): Promise<Map<string, string[] | undefined>> {
  return ESDefaultClient.post(`${ESIndex.USER_RELATION}/_doc/_mget`, { ids: friendsList })
    .then(
      (response): Map<string, string[] | undefined> => {
        const friendList: Map<string, string[] | undefined> = new Map();
        response.data.docs.forEach((hit: ESSearchHITResponse): void => {
          hit._source.groups?.forEach((group): void => {
            if (friendList.get(group)) {
              const existingList: string[] | undefined = friendList.get(group);
              existingList?.push(hit._id);
              friendList.set(group, existingList);
            } else {
              const existingList = [hit._id];
              friendList.set(group, existingList);
            }
          });
        });
        return friendList;
      },
    )
    .catch(
      (error): Map<string, string[] | undefined> => {
        log.error(`ES Search Error => ${error.stack}.`);
        return new Map();
      },
    );
}

export async function getUser(id: string): Promise<SearchResultResponse> {
  return getDocumentByIDFromES(id, ESIndex.USER, ESDefaultClient, USER_SUMMARY_FIELDS).catch(
    async (): Promise<SearchResultResponse> => {
      return getFirestoreDocById(Collection.USERS, id, USER_SUMMARY_FIELDS);
    },
  );
}

export async function getUserCourses(id: string): Promise<ResponseWrapperModel<SearchResultResponse>> {
  return getPublisherCourses(id);
}

export async function getUserGroups(
  id: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const userRelationFromES = (await getDocumentByIDFromES(id, ESIndex.USER_RELATION)) as UserRelationResponse;
  const groupListFromES = userRelationFromES.groups?.slice(offset, limit) || [];
  const friendListFromES = userRelationFromES.friends?.slice(offset, limit) || [];
  const resultsFromES = await getDocumentsByIDListFromES(groupListFromES, ESIndex.GROUP, GROUP_SUMMARY_FIELDS);
  if (resultsFromES.total === 0) {
    const conditionsForSearch: FSSearchCondition[] = [];
    const conditionsForSort: FSSortCondition[] = [];
    conditionsForSort.push({
      fieldPath: 'joined_at.epoch',
      directionStr: 'desc',
    });
    const fieldMasks: string[] = GROUP_RELATION_SUMMARY_FIELDS;
    const resultsFromFS = await getFirestoreDocuments(
      `${Collection.USERS}/${id}/group_relation`,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      fieldMasks,
      SearchResultType.GROUPS,
    );
    return { total: resultsFromFS.total, items: resultsFromFS.items };
  }
  const friendsGroupFromES = await getESQueryForFriendsGroup(friendListFromES);
  resultsFromES.items.forEach((e): void => {
    if (friendsGroupFromES.get(e.id)) {
      Object.assign(e, { friends: friendsGroupFromES.get(e.id) });
    }
  });
  return { total: userRelationFromES?.groups?.length || 0, items: resultsFromES.items };
}

export async function getUserFollowings(
  id: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const userRelationFromES = (await getDocumentByIDFromES(
    id,
    ESIndex.USER_RELATION,
    ESDefaultClient,
  )) as UserRelationResponse;
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const followingsListFromES = userRelationFromES.followings?.slice(offset, limit) || [];
  const resultsFromES = await getDocumentsByIDListFromES(followingsListFromES, ESIndex.USER, USER_SUMMARY_FIELDS);
  if (resultsFromES.total === 0) {
    let conditionsForSearch: FSSearchCondition[] = [];
    conditionsForSearch.push({
      fieldPath: 'is_following',
      opStr: '==',
      value: true,
    });
    let conditionsForSort: FSSortCondition[] = [];
    const fieldMasks: string[] = USER_RELATION_SUMMARY_FIELDS;
    const userRelationFromFS = await getFirestoreDocuments(
      `/${Collection.USERS}/${id}/user_relation`,
      conditionsForSearch,
      conditionsForSort,
      offset,
      FS_IN_QUERY_LIMIT,
      fieldMasks,
      SearchResultType.USER_RELATION,
    );

    const followingsListFromFS = userRelationFromFS.items.map((item): string => item.id);
    conditionsForSearch = [];
    conditionsForSearch.push({
      fieldPath: 'id',
      opStr: FSWhereOperator.IN,
      value: followingsListFromFS,
    });
    conditionsForSort = [];
    return getFirestoreDocuments(
      Collection.USERS,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      USER_SUMMARY_FIELDS,
    );
  }
  return { total: userRelationFromES?.followings?.length || 0, items: resultsFromES.items };
}

export async function getUserFriends(
  id: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const userRelationFromES = (await getDocumentByIDFromES(id, ESIndex.USER_RELATION)) as UserRelationResponse;
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const friendsListFromES = userRelationFromES.friends?.slice(offset, limit) || [];
  const resultsFromES = await getDocumentsByIDListFromES(friendsListFromES, ESIndex.USER, USER_SUMMARY_FIELDS);
  if (resultsFromES.total === 0) {
    let conditionsForSearch: FSSearchCondition[] = [];
    conditionsForSearch.push({
      fieldPath: 'is_friend',
      opStr: '==',
      value: true,
    });
    let conditionsForSort: FSSortCondition[] = [];
    const fieldMasks: string[] = USER_RELATION_SUMMARY_FIELDS;
    const userRelationFromFS = await getFirestoreDocuments(
      `/${Collection.USERS}/${id}/user_relation`,
      conditionsForSearch,
      conditionsForSort,
      offset,
      FS_IN_QUERY_LIMIT,
      fieldMasks,
      SearchResultType.USER_RELATION,
    );

    const friendsListFromFS = userRelationFromFS.items.map((item): string => item.id);
    conditionsForSearch = [];
    conditionsForSearch.push({
      fieldPath: 'id',
      opStr: FSWhereOperator.IN,
      value: friendsListFromFS,
    });
    conditionsForSort = [];

    return getFirestoreDocuments(
      Collection.USERS,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      USER_SUMMARY_FIELDS,
    );
  }
  return { total: userRelationFromES?.friends?.length || 0, items: resultsFromES.items };
}

export async function getUserFollowers(
  id: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const userRelationFromES = (await getDocumentByIDFromES(id, ESIndex.USER_RELATION)) as UserRelationResponse;
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const followersListFromES = userRelationFromES.followers?.slice(offset, limit) || [];
  const resultsFromES = await getDocumentsByIDListFromES(followersListFromES, ESIndex.USER, USER_SUMMARY_FIELDS);
  if (resultsFromES.total === 0) {
    let conditionsForSearch: FSSearchCondition[] = [];
    conditionsForSearch.push({
      fieldPath: 'is_followed_by',
      opStr: '==',
      value: true,
    });
    let conditionsForSort: FSSortCondition[] = [];
    const userRelationFromFS = await getFirestoreDocuments(
      `/${Collection.USERS}/${id}/user_relation`,
      conditionsForSearch,
      conditionsForSort,
      offset,
      FS_IN_QUERY_LIMIT,
      USER_RELATION_SUMMARY_FIELDS,
      SearchResultType.USER_RELATION,
    );

    const followersListFromFS = userRelationFromFS.items.map((item): string => item.id);
    conditionsForSearch = [];
    conditionsForSearch.push({
      fieldPath: 'id',
      opStr: FSWhereOperator.IN,
      value: followersListFromFS,
    });
    conditionsForSort = [];
    return getFirestoreDocuments(
      Collection.USERS,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      USER_SUMMARY_FIELDS,
    );
  }
  return { total: userRelationFromES?.followers?.length || 0, items: resultsFromES.items };
}
