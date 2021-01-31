import * as builder from 'elastic-builder';
import { ParsedQs } from 'qs';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { USER_SUMMARY_FIELDS } from '../../model/user/user.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { ESIndex } from '../../shared/enum';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import encodeStringToMD5 from '../shared/crypto.service';
import { getDocumentsByIDListFromES, getSingleIndexResultsFromES } from '../shared/elastic.service';
import transformToUnifiedSearchResults from '../shared/transform.service';
// import path from 'path';
// import logger from '../../../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForUserRegularSearch(id: string, queryParams: ParsedQs): builder.RequestBodySearch {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const scoreFunctions = [
    builder.fieldValueFactorFunction('number_of_members').factor(0.02).modifier('sqrt').missing(0),
  ];
  const mainQuery = builder.boolQuery().must(builder.matchQuery('email_domains', id));
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
    .source(['id', 'email_domains'])
    .from(offset)
    .size(limit);
  return reqBody;
}

export async function getDomainFilterResultsFromES(
  id: string,
  queryParams: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForUserRegularSearch(id, queryParams);
  const result = await getSingleIndexResultsFromES(ESIndex.USER_RELATION, esQuery);
  const userIds = result.items.map((e): string => e.id);
  return getDocumentsByIDListFromES(userIds, ESIndex.USER, USER_SUMMARY_FIELDS);
}

export default async function domainMembers(
  domainId: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const encodedId = encodeStringToMD5(domainId);
  const resultsFromES = await getDomainFilterResultsFromES(encodedId, queryParams);
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
