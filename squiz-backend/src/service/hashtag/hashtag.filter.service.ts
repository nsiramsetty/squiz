import * as builder from 'elastic-builder';
// import path from 'path';
import { ParsedQs } from 'qs';
import { HASHTAG_SUMMARY_FIELDS } from '../../model/hashtag/hashtag.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { ESIndex } from '../../shared/enum';
// import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForHashtagsRegularFilter(queryParams: ParsedQs): builder.RequestBodySearch {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const sort_option: string = queryParams.sort_option?.toString().trim();
  const sort_direction: string = queryParams.sort_direction?.toString().trim();

  const queries: builder.Query[] = [];

  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(HASHTAG_SUMMARY_FIELDS);
  if (sort_option) {
    switch (sort_option.toLowerCase()) {
      case 'newest':
        reqBody.sort(builder.sort('created_at.epoch', sort_direction || 'desc'));
        break;
      case 'name':
        reqBody.sort(builder.sort('name.keyword', sort_direction || 'desc'));
        break;
      default:
        reqBody.sort(builder.sort('created_at.epoch', sort_direction || 'desc'));
        break;
    }
  }
  const matchQuery = keyword
    ? builder.multiMatchQuery(['name', 'topic', 'short_description', 'long_description'], keyword)
    : builder.matchAllQuery();
  queries.push(builder.boolQuery().must(matchQuery));
  return reqBody.query(builder.boolQuery().must(queries));
}

export async function getHashtagFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForHashtagsRegularFilter(queryParams);
  return getSingleIndexResultsFromES(ESIndex.HASHTAG, esQuery);
}

export async function filterHashtags(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const resultsFromES = await getHashtagFilterResultsFromES(queryParams);
  return {
    total: resultsFromES.total,
    items: transformToUnifiedSearchResults(resultsFromES.items),
  };
}
