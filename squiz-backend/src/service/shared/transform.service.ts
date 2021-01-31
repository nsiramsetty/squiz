import { JsonObject } from 'swagger-ui-express';
import config from '../../config';
import { GroupResponse } from '../../model/group/group.model';
import {
  SearchResultResponse,
  UnifiedSearchItem,
  UnifiedSearchResponse,
} from '../../model/response/search-result.model';
import { UserResponse } from '../../model/user/user.model';
import { LogLevel, SearchResultType, SearchSummaryResultKeys } from '../../shared/enum';

function addMetaSummary(item: UnifiedSearchResponse, cloneItem: SearchResultResponse): void {
  if (cloneItem.search_result_type === SearchResultType.USERS) {
    const userResponse = cloneItem as UserResponse;
    if (userResponse.is_friend) {
      Object.assign(item, { relation: { is_friend: true } });
      delete userResponse.is_friend;
    }
    if (userResponse.is_friend_of_friend || userResponse.mutual_friends) {
      Object.assign(item, { relation: { is_friend_of_friend: true, mutual_friends: userResponse.mutual_friends } });
      delete userResponse.is_friend_of_friend;
      delete userResponse.mutual_friends;
    }
    if (userResponse.is_following) {
      if (item.relation) {
        Object.assign(item.relation, { is_following: true });
      } else {
        Object.assign(item, { relation: { is_following: true } });
      }
      delete userResponse.is_following;
    }
    if (userResponse.friends_who_are_following) {
      if (item.relation) {
        Object.assign(item.relation, { friends_who_are_following: userResponse.friends_who_are_following });
      } else {
        Object.assign(item, { relation: { friends_who_are_following: userResponse.friends_who_are_following } });
      }
      delete userResponse.friends_who_are_following;
    }
  }
  if (cloneItem.search_result_type === SearchResultType.GROUPS) {
    const groupResponse = cloneItem as GroupResponse;
    if ('is_member' in cloneItem) {
      Object.assign(item, { relation: { is_member: groupResponse.is_member } });
      delete groupResponse.is_member;
    }
    if (groupResponse.friends) {
      if (item.relation) {
        Object.assign(item.relation, { friends: groupResponse.friends });
      } else {
        Object.assign(item, { relation: { friends: groupResponse.friends } });
      }
      delete groupResponse.friends;
    }
  }
}

export default function transformToUnifiedSearchResults(items: SearchResultResponse[]): UnifiedSearchResponse[] {
  const itemArray: UnifiedSearchResponse[] = [];
  items.forEach((key: SearchResultResponse): void => {
    const cloneKey = key as JsonObject;
    const keyName: SearchResultType = cloneKey.search_result_type;
    const summaryKeyName: SearchResultType = cloneKey.search_result_type;
    const unifiedItem: UnifiedSearchItem = {
      type: keyName,
      [SearchSummaryResultKeys[summaryKeyName]]: cloneKey,
    };
    const item: UnifiedSearchResponse = { item_summary: unifiedItem };
    addMetaSummary(item, cloneKey as SearchResultResponse);
    // Removing Relations Temporarly
    // delete item.relation;
    itemArray.push(item);
    if (config.gae.logs.level?.toUpperCase() !== LogLevel.DEBUG) {
      delete cloneKey.source;
      delete cloneKey.score;
      delete cloneKey.search_result_type;
    }
  });
  return itemArray;
}
