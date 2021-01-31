import * as builder from 'elastic-builder';
// import path from 'path';
import { ParsedQs } from 'qs';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../../model/shared/elastic.model';
import { USER_SUMMARY_FIELDS } from '../../../model/user/user.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { ESIndex } from '../../../shared/enum';
// import logger from '../../../shared/logger';
import { numberOrDefault } from '../../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../../shared/elastic.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getPublisherESQueryForRegularFilter(queryParams: ParsedQs): builder.RequestBodySearch {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const starts_with: string = queryParams.starts_with?.toString().trim();
  const geo_distance: string = queryParams.geo_distance?.toString().trim();
  const geo_pin: string = queryParams.geo_pin?.toString().trim();
  const ids: string = queryParams.ids?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const sort_option: string = queryParams.sort_option?.toString().trim();
  const sort_direction: string = queryParams.sort_direction?.toString().trim();

  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(USER_SUMMARY_FIELDS);
  if (sort_option) {
    switch (sort_option.toLowerCase()) {
      case 'popular':
        reqBody.sort(builder.sort('publisher_follower_count', sort_direction || 'desc'));
        break;
      case 'alphabetical':
        reqBody.sort(builder.sort('name.keyword', sort_direction || 'asc'));
        break;
      case 'newest':
        reqBody.sort(builder.sort('created_at.epoch', sort_direction || 'desc'));
        break;
      default:
        reqBody.sort(builder.sort('name.keyword', sort_direction || 'asc'));
    }
  }
  const matchQuery = keyword ? builder.matchQuery('name', keyword) : builder.matchAllQuery();
  queries.push(builder.boolQuery().must(matchQuery));
  queries.push(builder.boolQuery().must(builder.matchQuery('is_publisher', 'true'.toLowerCase())));
  if (starts_with) {
    queries.push(
      builder
        .boolQuery()
        .should(starts_with.split(',').map((val): builder.PrefixQuery => builder.prefixQuery('name.keyword', val)))
        .minimumShouldMatch(1),
    );
  }
  if (geo_pin && geo_distance) {
    queries.push(
      builder
        .boolQuery()
        .filter(builder.geoDistanceQuery('region.location', builder.geoPoint().string(geo_pin)).distance(geo_distance)),
    );
  }
  if (ids) {
    queries.push(
      builder
        .boolQuery()
        .should(ids.split(',').map((val): builder.MatchQuery => builder.matchQuery('id', val)))
        .minimumShouldMatch(1),
    );
  }
  return reqBody.query(builder.boolQuery().must(queries));
}

export async function getPublisherFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getPublisherESQueryForRegularFilter(queryParams);
  return getSingleIndexResultsFromES(ESIndex.USER, esQuery);
}

export async function filterPublishers(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const resultsFromES = await getPublisherFilterResultsFromES(queryParams);
  return {
    total: resultsFromES.total,
    items: transformToUnifiedSearchResults(resultsFromES.items),
  };
}
