import * as builder from 'elastic-builder';
import path from 'path';
import { ParsedQs } from 'qs';
import { GROUP_SUMMARY_FIELDS, GROUP_SUMMARY_TOP_VIEW_FIELDS, WorkplaceEmail } from '../../model/group/group.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { UserRelationResponse } from '../../model/user/user.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, FSWhereOperator } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getDocumentsByIDListFromES, getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

const log = logger(path.relative(process.cwd(), __filename));

export async function getUserWorkspaceEmails(userID: string): Promise<WorkplaceEmail[]> {
  const colletionPath = `${Collection.USERS}/${userID}/private/settings/email_addresses`;
  const conditionsForSearch: FSSearchCondition[] = [];
  const conditionsForSort: FSSortCondition[] = [];
  const offset = 0;
  const limit = 10000;
  const fieldMasks: string[] = ['email_id', 'is_verified', 'is_deleted'];
  const resultsFromFS = await getFirestoreDocuments(
    colletionPath,
    conditionsForSearch,
    conditionsForSort,
    offset,
    limit,
    fieldMasks,
  );

  const items = resultsFromFS.items as WorkplaceEmail[];
  return items;
}

export async function getFriendsRegisteredWithGroups(friends: string[]): Promise<Map<string, string[] | undefined>> {
  const resultsFromES = await getDocumentsByIDListFromES(friends, ESIndex.USER_RELATION, ['groups']);
  const friendMap: Map<string, string[] | undefined> = new Map();
  resultsFromES.items.forEach((e: UserRelationResponse): void => {
    e.groups?.forEach((group: string): void => {
      if (friendMap.get(group)) {
        const existingList: string[] | undefined = friendMap.get(group);
        existingList?.push(e.id);
        friendMap.set(group, existingList);
      } else {
        const existingList = [e.id];
        friendMap.set(group, existingList);
      }
    });
  });
  return Promise.resolve(friendMap);
}

export async function getESQueryForGroupsRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
  queryParams?: ParsedQs,
): Promise<builder.RequestBodySearch> {
  const searchFields = ['name^4', 'long_description', 'created_by.name'];
  const queries: builder.Query[] = [];
  const domains: string[] = queryParams?.include_email_domains
    ? queryParams.include_email_domains?.toString().split(',')
    : [];
  const deviceLang: string | undefined = queryParams?.device_lang?.toString().trim();
  const scoreFunctions = [
    builder.weightScoreFunction().filter(builder.termQuery('name.keyword', keyword)).weight(50),
    builder.weightScoreFunction().filter(builder.multiMatchQuery(searchFields, keyword).fuzziness(0)).weight(25),
    builder.fieldValueFactorFunction('member_count').factor(0.0009).modifier('sqrt').missing(0),
  ];
  if (deviceLang) {
    scoreFunctions.push(
      builder.weightScoreFunction().filter(builder.termQuery('created_by_device_lang', deviceLang)).weight(10),
    );
  }
  queries.push(builder.multiMatchQuery(searchFields, keyword).fuzziness(2));
  queries.push(builder.boolQuery().mustNot(builder.matchQuery('type.keyword', 'LEGACY')));
  queries.push(builder.boolQuery().mustNot(builder.termQuery('is_deleted', true)));
  queries.push(builder.boolQuery().must(builder.matchQuery('privacy_type.keyword', 'PUBLIC')));
  queries.push(builder.boolQuery().must(builder.termQuery('privacy_hidden', false)));
  if (domains && Array.isArray(domains) && domains.length > 0) {
    queries.push(
      builder
        .boolQuery()
        .should([
          builder.matchQuery('type.keyword', 'GROUP'),
          builder
            .boolQuery()
            .should(domains.map((val): builder.MatchQuery => builder.matchQuery('email_domains', val)))
            .minimumShouldMatch(1),
        ])
        .minimumShouldMatch(1),
    );
  } else {
    queries.push(builder.boolQuery().must(builder.matchQuery('type.keyword', 'GROUP')));
  }

  const mainQuery = builder.boolQuery().must(queries);
  return builder
    .requestBodySearch()
    .query(builder.functionScoreQuery().query(mainQuery).functions(scoreFunctions).scoreMode('sum').boostMode('sum'))
    .source(GROUP_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export function getESQueryForGroupsTopViewSearch(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
): builder.RequestBodySearch {
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
    .query(
      builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
          builder.weightScoreFunction().filter(builder.termQuery('language.iso_639_1.keyword', deviceLang)).weight(2.2),
          builder.fieldValueFactorFunction('member_count').factor(0.009).modifier('sqrt').missing(0),
          builder.weightScoreFunction().filter(builder.termQuery('name.keyword', keyword)).weight(20),
        ])
        .scoreMode('sum')
        .boostMode('sum'),
    )
    .source(GROUP_SUMMARY_TOP_VIEW_FIELDS)
    .from(offset)
    .size(limit);
}

export async function getGroupSearchResultsFromFS(
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
    fieldPath: 'type',
    opStr: FSWhereOperator.EQUAL_TO,
    value: 'GROUP',
  });
  conditionsForSearch.push({
    fieldPath: 'privacy_type',
    opStr: FSWhereOperator.EQUAL_TO,
    value: 'PUBLIC',
  });
  conditionsForSearch.push({
    fieldPath: 'privacy_hidden',
    opStr: FSWhereOperator.EQUAL_TO,
    value: false,
  });
  const conditionsForSort: FSSortCondition[] = [];
  const fieldMasks: string[] = GROUP_SUMMARY_FIELDS;
  return getFirestoreDocuments(Collection.GROUPS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export async function getGroupSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
  queryParams?: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const esQuery = await getESQueryForGroupsRegularSearch(keyword, offset, limit, queryParams);
  const esResult = await getSingleIndexResultsFromES(ESIndex.GROUP, esQuery);
  return esResult;
}

export async function searchGroups(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`searchGroups :: Parameter => query :: is Required`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  try {
    const resultsFromES = await getGroupSearchResultsFromES(keyword, offset, limit, queryParams);
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    log.error(`searchEvents:: ${error}`);
    const resultsFromFS = await getGroupSearchResultsFromFS(keyword, offset, limit);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
}
