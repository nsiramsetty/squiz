import * as builder from 'elastic-builder';
// import path from 'path';
import { ParsedQs } from 'qs';
import { PLAYLIST_SUMMARY_FIELDS } from '../../model/playlist/playlist.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { ESIndex } from '../../shared/enum';
// import logger from '../../shared/logger';
import { booleanOrDefault, numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getPlaylistESQueryForRegularFilter(queryParams: ParsedQs): builder.RequestBodySearch {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const hashtags = queryParams.hashtags?.toString().trim();
  const sort_option = queryParams.sort_option?.toString().trim();
  const sortDirection: string = queryParams.sort_direction?.toString().trim();
  const includeDescription = booleanOrDefault(queryParams.include_description, false);
  const region_name = queryParams.region_name?.toString().trim();
  const source = PLAYLIST_SUMMARY_FIELDS;
  const queries: builder.Query[] = [];
  if (includeDescription) {
    source.push('description');
  }
  const reqBody: builder.RequestBodySearch = builder.requestBodySearch().from(offset).size(limit).source(source);
  queries.push(builder.rangeQuery('number_of_library_items').gte(3));
  const matchQuery = keyword ? builder.matchQuery('title', keyword) : builder.matchAllQuery();
  queries.push(builder.boolQuery().must(matchQuery));
  if (hashtags) {
    queries.push(
      builder
        .boolQuery()
        .must(hashtags.split(',').map((val): builder.MatchQuery => builder.matchQuery('hashtags', val.toLowerCase()))),
    );
  }
  if (region_name) {
    queries.push(builder.boolQuery().must(builder.matchQuery('owner.region.name', region_name.toLowerCase())));
  }
  if (sort_option) {
    switch (sort_option.toLowerCase()) {
      case 'newest':
        reqBody.sort(builder.sort('created_at.epoch', sortDirection || 'desc'));
        break;
      case 'popular':
        reqBody.sort(builder.sort('number_of_followers', sortDirection || 'desc'));
        break;
      default:
        reqBody.sort(builder.sort('created_at.epoch', sortDirection || 'desc'));
    }
  }
  const finalBool = builder.boolQuery().must(queries);
  return reqBody.query(finalBool);
}

export async function getPlaylistFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getPlaylistESQueryForRegularFilter(queryParams);
  return getSingleIndexResultsFromES(ESIndex.PLAYLIST, esQuery);
}

export async function filterPlaylists(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const resultsFromES = await getPlaylistFilterResultsFromES(queryParams);
  return {
    total: resultsFromES.total,
    items: transformToUnifiedSearchResults(resultsFromES.items),
  };
}
