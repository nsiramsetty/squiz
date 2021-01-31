import * as builder from 'elastic-builder';
import { ParsedQs } from 'qs';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { ESIndex } from '../../shared/enum';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import transformToUnifiedSearchResults from '../shared/transform.service';
// import path from 'path';
// import logger from '../../../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForDomainsRegularSearch(queryParams: ParsedQs): builder.RequestBodySearch {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const sort_option: string = queryParams.sort_option?.toString().trim();
  const sort_direction: string = queryParams.sort_direction?.toString().trim();
  const mainQuery = builder.boolQuery().must(keyword ? builder.termQuery('name', keyword) : builder.matchAllQuery());

  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .query(mainQuery)
    .source(['id', 'name'])
    .from(offset)
    .size(limit);

  if (!keyword && sort_option) {
    switch (sort_option.toLowerCase()) {
      case 'most_members':
        reqBody.sort(builder.sort('number_of_members', sort_direction || 'desc'));
        break;
      default:
        break;
    }
  }
  return reqBody;
}

export async function getDomainFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForDomainsRegularSearch(queryParams);
  return getSingleIndexResultsFromES(ESIndex.EMAIL_DOMAIN, esQuery);
}

export default async function filterDomains(
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const resultsFromES = await getDomainFilterResultsFromES(queryParams);
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
