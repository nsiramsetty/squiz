import * as builder from 'elastic-builder';
import path from 'path';
import { ParsedQs } from 'qs';
import { GROUP_SUMMARY_FIELDS } from '../../model/group/group.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, FSWhereOperator } from '../../shared/enum';
import logger from '../../shared/logger';
import { booleanOrDefault, numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForGroupsRegularFilter(queryParams: ParsedQs): builder.RequestBodySearch {
  const query: string | undefined = queryParams.query?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const group_types = queryParams.group_types?.toString().trim();
  const privacy_types = queryParams.privacy_types?.toString().trim();
  const include_hidden: boolean = booleanOrDefault(queryParams.include_hidden, false);
  const include_deleted: boolean = booleanOrDefault(queryParams.include_deleted, false);
  const email_domains: string[] = queryParams.email_domains ? queryParams.email_domains?.toString().split(',') : [];
  const sort_option: string = queryParams.sort_option?.toString().trim();
  const sort_direction: string = queryParams.sort_direction?.toString().trim();

  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(GROUP_SUMMARY_FIELDS);
  if (!query && sort_option) {
    switch (sort_option.toLowerCase()) {
      case 'newest':
        reqBody.sort(builder.sort('created_at.epoch', sort_direction || 'desc'));
        break;
      case 'most_members':
        reqBody.sort(builder.sort('member_count', sort_direction || 'desc'));
        break;
      default:
        break;
    }
  }
  queries.push(builder.boolQuery().mustNot(builder.matchQuery('type.keyword', 'LEGACY')));
  queries.push(
    builder
      .boolQuery()
      .should([builder.matchQuery('type.keyword', 'GROUP'), builder.matchQuery('type.keyword', 'ENTERPRISE')])
      .minimumShouldMatch(1),
  );
  if (group_types && group_types.trim() !== '') {
    const group_types_array: string[] = group_types.split(',');
    if (group_types_array.length > 0) {
      queries.push(
        builder
          .boolQuery()
          .should(group_types_array.map((val): builder.MatchQuery => builder.matchQuery('type', val)))
          .minimumShouldMatch(1),
      );
    }
  }
  if (privacy_types && privacy_types.trim() !== '') {
    const privacy_types_array: string[] = privacy_types.split(',');
    if (privacy_types_array.length > 0) {
      queries.push(
        builder
          .boolQuery()
          .should(privacy_types_array.map((val): builder.MatchQuery => builder.matchQuery('privacy_type', val)))
          .minimumShouldMatch(1),
      );
    }
  }
  if (!include_hidden) {
    queries.push(
      builder
        .boolQuery()
        .should([
          builder.matchQuery('privacy_type.keyword', 'PUBLIC'),
          builder
            .boolQuery()
            .must([builder.matchQuery('privacy_type.keyword', 'PRIVATE'), builder.termQuery('privacy_hidden', false)]),
        ])
        .minimumShouldMatch(1),
    );
  }

  if (!include_deleted) {
    queries.push(builder.boolQuery().mustNot(builder.termQuery('is_deleted', true)));
  }

  if (email_domains.length) {
    queries.push(
      builder
        .boolQuery()
        .should(email_domains.map((val): builder.MatchQuery => builder.matchQuery('email_domains', val)))
        .minimumShouldMatch(1),
    );
  }
  const matchQuery = query ? builder.multiMatchQuery(['name'], query).fuzziness(2) : builder.matchAllQuery();
  queries.push(builder.boolQuery().must(matchQuery));

  return reqBody.query(builder.boolQuery().must(queries));
}

export async function getGroupSearchResultsFromFS(queryParams: ParsedQs): Promise<FSSearchTransformResponse> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
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

export async function getGroupFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForGroupsRegularFilter(queryParams);
  return getSingleIndexResultsFromES(ESIndex.GROUP, esQuery, true);
}

export async function filterGroups(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getGroupFilterResultsFromES(queryParams);
    return {
      total: resultsFromES.total,
      items: transformToUnifiedSearchResults(resultsFromES.items),
    };
  } catch (error) {
    log.error(`filterGroups:: ${error}`);
    const resultsFromFS = await getGroupSearchResultsFromFS(queryParams);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
}
