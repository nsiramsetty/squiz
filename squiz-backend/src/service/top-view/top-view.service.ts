import * as builder from 'elastic-builder';
import * as lodash from 'lodash';
import moment from 'moment';
// import path from 'path';
import { ParsedQs } from 'qs';
import { JsonObject } from 'swagger-ui-express';
import { ESDefaultClient } from '../../helper/axios.helper';
import { EVENT_SUMMARY_TOP_VIEW_FIELDS } from '../../model/event/event.model';
import { GROUP_SUMMARY_TOP_VIEW_FIELDS } from '../../model/group/group.model';
import { HASHTAG_SUMMARY_TOP_VIEW_FIELDS } from '../../model/hashtag/hashtag.model';
import {
  COURSE_SUMMARY_TOP_VIEW_FIELDS,
  DAILY_INSIGHT_ITEM_SUMMARY_TOP_VIEW_FIELDS,
  SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS,
} from '../../model/library-item/library-item.model';
import { PLAYLIST_SUMMARY_TOP_VIEW_FIELDS } from '../../model/playlist/playlist.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { SearchResultResponse, UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchDOCSourceResponse, ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchTransformResponse } from '../../model/shared/firestore.model';
import { UserRelationMySql, USER_SUMMARY_TOP_VIEW_FIELDS } from '../../model/user/user.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { ESIndex, ItemType, SearchResultType, SupportedLanguage } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
// import logger from '../../shared/logger';
import { booleanOrDefault, numberOrDefault } from '../../utils/query-parameter-parser';
import { getESQueryFoEventsTopViewSearch, getEventSearchResultsFromFS } from '../event/event.search.service';
import { getESQueryForGroupsTopViewSearch, getGroupSearchResultsFromFS } from '../group/group.search.service';
import { getESQueryForHashtagsTopViewSearch, getHashtagSearchResultsFromFS } from '../hashtag/hashtag.search.service';
import { getAudioSearchResultsFromFS, getESQueryForAudioTopViewSearch } from '../library-item/audio.search.service';
import {
  getESQueryForPlaylistTopViewSearch,
  getPlaylistSearchResultsFromFS,
} from '../playlist/playlist.search.service';
import { getMultiIndexResultsFromES, getSingleIndexResultsFromES } from '../shared/elastic.service';
import { mergeMultipleTransformFromFSResponse } from '../shared/firestore.service';
import { validateAndReplaceWithEnglish } from '../shared/i18n.service';
import transformToUnifiedSearchResults from '../shared/transform.service';
import {
  getESQueryForUsersTopViewSearch,
  getUserFriendsMysql,
  getUserSearchResultsFromFS,
} from '../user/user/user.search.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getCommonESQueryForTopSearch(queryParams: ParsedQs, friends?: string[]): builder.RequestBodySearch {
  const fields = [
    'title^4',
    'learn_description',
    'content_type',
    'publisher.name^2',
    // 'long_description',
    // 'short_description',
    'description',
    'hashtags',
    'owner.name^2',
    'region.name',
    'name^3',
    'topic',
  ];

  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const deviceLang = validateAndReplaceWithEnglish([queryParams.device_lang?.toString().trim()])[0];
  const excludePublishers: boolean = booleanOrDefault(queryParams.exclude_publishers, false);
  const epoch = moment.utc().add(moment.duration(0, 'minutes')).valueOf();
  const scoreFunctions = [
    builder
      .weightScoreFunction()
      .filter(builder.termQuery('lang.iso_639_1', deviceLang))
      .weight(deviceLang === SupportedLanguage.ENGLISH ? 20 : 30),
    builder.weightScoreFunction().filter(builder.termQuery('title.keyword', keyword.toLowerCase())).weight(50),
    builder.weightScoreFunction().filter(builder.termQuery('name.keyword', keyword.toLowerCase())).weight(50),
    builder
      .weightScoreFunction()
      .filter(builder.multiMatchQuery(fields, keyword).fuzziness(0).type('most_fields'))
      .weight(100),
    builder
      .weightScoreFunction()
      .filter(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('best_fields'))
      .weight(50),
    builder
      .weightScoreFunction()
      .filter(builder.boolQuery().mustNot(builder.existsQuery('avatar')))
      .weight(-5),
    builder
      .weightScoreFunction()
      .filter(builder.rangeQuery('_next_occurrences.start_date.epoch').lt(epoch))
      .weight(-500),
    builder.fieldValueFactorFunction('member_count').factor(0.0009).modifier('sqrt').missing(0),
  ];

  const mainQuery = builder.boolQuery().must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('most_fields'));
  if (excludePublishers) {
    mainQuery.filter(builder.termQuery('is_publisher', false));
  }
  if (friends && friends.length) {
    scoreFunctions.push(builder.weightScoreFunction().filter(builder.termsQuery('_id', friends)).weight(100));
  }
  return builder
    .requestBodySearch()
    .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
    .from(offset)
    .size(limit);
}

export async function getTopViewSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  return mergeMultipleTransformFromFSResponse(
    [
      await getAudioSearchResultsFromFS(keyword, offset, limit),
      await getPlaylistSearchResultsFromFS(keyword, offset, limit),
      await getGroupSearchResultsFromFS(keyword, offset, limit),
      await getHashtagSearchResultsFromFS(keyword, offset, limit),
      await getUserSearchResultsFromFS(keyword, offset, limit),
      await getEventSearchResultsFromFS(keyword, offset, limit),
    ],
    limit,
  );
}

export async function getTopViewSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
  excludePublishers: boolean = false,
  userID: string,
  singleTrackOnly: boolean = false,
  queryParams: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const esQuery =
    // `{"index" : "${ESIndex.LIBRARY_ITEM}"}\n${JSON.stringify(
    //   courseQueryForTopView(deviceLang, keyword, offset, limit),
    // )}\n` +
    // `{"index" : "${ESIndex.LIBRARY_ITEM}"}\n${JSON.stringify(
    //   libraryItemQueryForTopView(deviceLang, keyword, offset, limit, queryParams),
    // )}\n` +
    `{"index" : "${ESIndex.LIBRARY_ITEM}"}\n${JSON.stringify(
      getESQueryForAudioTopViewSearch(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams),
    )}\n` +
    `{"index" : "${ESIndex.PLAYLIST}"}\n${JSON.stringify(
      getESQueryForPlaylistTopViewSearch(keyword, offset, limit, deviceLang),
    )}\n` +
    `{"index" : "${ESIndex.EVENT}"}\n${JSON.stringify(getESQueryFoEventsTopViewSearch(keyword, offset, limit))}\n` +
    `{"index" : "${ESIndex.USER}"}\n${JSON.stringify(
      getESQueryForUsersTopViewSearch(keyword, offset, limit, excludePublishers, userID),
    )}\n` +
    `{"index" : "${ESIndex.HASHTAG}"}\n${JSON.stringify(
      getESQueryForHashtagsTopViewSearch(keyword, offset, limit, deviceLang),
    )}\n` +
    `{"index" : "${ESIndex.GROUP}"}\n${JSON.stringify(
      getESQueryForGroupsTopViewSearch(keyword, offset, limit, deviceLang),
    )}\n`;
  return getMultiIndexResultsFromES(ESDefaultClient, esQuery, limit);
}

export async function getTopViewSearchResultsFromESV2(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  let friends: string[] = [];
  const filteredRecords: JsonObject[] = [];
  const userID: string | undefined = queryParams.user_id?.toString();
  let relations: UserRelationMySql[] = [];
  if (userID) {
    const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
    const keyword: string | undefined = queryParams.query?.toString().trim();
    relations = await getUserFriendsMysql(keyword, userID, offset, limit);
    friends = relations.map((relation: UserRelationMySql): string => relation.user_id.toString());
  }
  const esQuery = getCommonESQueryForTopSearch(queryParams, friends);
  const indexName = `${ESIndex.EVENT},${ESIndex.LIBRARY_ITEM},${ESIndex.PLAYLIST},${ESIndex.USER},${ESIndex.HASHTAG},${ESIndex.GROUP}`;
  const response = await getSingleIndexResultsFromES(indexName, esQuery);

  response.items.forEach((item): void => {
    if (item.search_result_type === SearchResultType.EVENTS) {
      filteredRecords.push({
        ...lodash.pick(item, EVENT_SUMMARY_TOP_VIEW_FIELDS),
        search_result_type: item.search_result_type,
      });
    } else if (item.search_result_type === SearchResultType.LIBRARY_ITEMS) {
      if (item.item_type === ItemType.COURSES) {
        filteredRecords.push({
          ...lodash.pick(item, COURSE_SUMMARY_TOP_VIEW_FIELDS),
          search_result_type: item.search_result_type,
        });
      } else if (item.item_type === ItemType.DAILY_INSIGHT) {
        filteredRecords.push({
          ...lodash.pick(item, DAILY_INSIGHT_ITEM_SUMMARY_TOP_VIEW_FIELDS),
          search_result_type: item.search_result_type,
        });
      } else {
        filteredRecords.push({
          ...lodash.pick(item, SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS),
          search_result_type: item.search_result_type,
        });
      }
    } else if (item.search_result_type === SearchResultType.PLAYLISTS) {
      filteredRecords.push({
        ...lodash.pick(item, PLAYLIST_SUMMARY_TOP_VIEW_FIELDS),
        search_result_type: item.search_result_type,
      });
    } else if (item.search_result_type === SearchResultType.USERS) {
      if (userID && userID !== item.id) {
        const userFound = relations.find((relation): boolean => relation.user_id === item.id);
        if (userFound) {
          if (userFound.friend_id === 'self') {
            Object.assign(item, { is_friend: true });
          } else {
            Object.assign(item, { is_friend_of_friend: true });
            Object.assign(item, { mutual_friends: [{ id: userFound.friend_id, name: userFound.friend_name }] });
          }
        }
      }
      filteredRecords.push({
        ...lodash.pick(item, USER_SUMMARY_TOP_VIEW_FIELDS),
        search_result_type: item.search_result_type,
      });
    } else if (item.search_result_type === SearchResultType.HASHTAGS) {
      filteredRecords.push({
        ...lodash.pick(item, HASHTAG_SUMMARY_TOP_VIEW_FIELDS),
        search_result_type: item.search_result_type,
      });
    } else if (item.search_result_type === SearchResultType.GROUPS) {
      filteredRecords.push({
        ...lodash.pick(item, GROUP_SUMMARY_TOP_VIEW_FIELDS),
        search_result_type: item.search_result_type,
      });
    }
  });

  return { total: response.total, items: filteredRecords as ESSearchDOCSourceResponse[] };
}

export async function searchTopView(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`SearchTopView :: query :: is Required for Top View Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const userID: string = queryParams.user_id?.toString().trim();
  const deviceLang = validateAndReplaceWithEnglish([queryParams.device_lang?.toString().trim()])[0];
  const excludePublishers: boolean = booleanOrDefault(queryParams.exclude_publishers, false);
  const singleTrackOnly = booleanOrDefault(queryParams.single_tracks_only, false);

  return getTopViewSearchResultsFromES(
    keyword,
    offset,
    limit,
    deviceLang,
    excludePublishers,
    userID,
    singleTrackOnly,
    queryParams,
  ).then(
    async (response): Promise<ResponseWrapperModel<UnifiedSearchResponse>> => {
      let items: SearchResultResponse[] = [];
      if (userID && response.items[0] && response.items[0].id === userID) {
        items.push(response.items[0]);
        response.items.shift();
      }
      if (response.total === 0) {
        const resultsFromFS = await getTopViewSearchResultsFromFS(keyword, offset, limit);
        return { total: resultsFromFS.total, items: transformToUnifiedSearchResults(resultsFromFS.items) };
      }
      items = lodash.uniqBy(items, 'id');
      return { total: response.total, items: transformToUnifiedSearchResults(response.items) };
    },
  );
}

export async function searchTopViewV2(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`SearchTopViewV2 :: query :: is Required for Top View Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const resultsFromES = await getTopViewSearchResultsFromESV2(queryParams);
  if (resultsFromES.total === 0) {
    const resultsFromFS = await getTopViewSearchResultsFromFS(keyword, offset, limit);
    return { total: resultsFromFS.total, items: transformToUnifiedSearchResults(resultsFromFS.items) };
  }
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
