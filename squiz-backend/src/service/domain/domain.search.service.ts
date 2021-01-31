import * as builder from 'elastic-builder';
import { ParsedQs } from 'qs';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { ESIndex } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import transformToUnifiedSearchResults from '../shared/transform.service';
// import path from 'path';
// import logger from '../../../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForDomainsRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
): builder.RequestBodySearch {
  const scoreFunctions = [
    builder.fieldValueFactorFunction('number_of_members').factor(0.02).modifier('sqrt').missing(0),
  ];
  const mainQuery = builder.boolQuery().must(builder.matchQuery('name.keyword', keyword).fuzziness(2));
  return builder
    .requestBodySearch()
    .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
    .source(['id', 'name'])
    .from(offset)
    .size(limit)
    .sort(builder.sort('number_of_members', 'desc'));
}

export async function getDomainSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForDomainsRegularSearch(keyword, offset, limit);
  return getSingleIndexResultsFromES(ESIndex.EMAIL_DOMAIN, esQuery);
}

export default async function searchDomains(
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`searchDomains :: Parameter => keyword :: is Required`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const resultsFromES = await getDomainSearchResultsFromES(keyword, offset, limit);
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
