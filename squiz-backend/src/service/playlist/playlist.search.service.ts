import * as builder from 'elastic-builder';
import moment from 'moment';
// import path from 'path';
import { ParsedQs } from 'qs';
import { PLAYLIST_SUMMARY_FIELDS, PLAYLIST_SUMMARY_TOP_VIEW_FIELDS } from '../../model/playlist/playlist.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, SupportedLanguage } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
// import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getPlaylistESQueryForRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
): builder.RequestBodySearch {
  const epoch = moment.utc().subtract(moment.duration(5, 'minutes')).valueOf();
  const fields = ['title^2.8', 'owner.name'];
  const mainQuery = builder
    .boolQuery()
    .must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'))
    .must(builder.termQuery('is_private', false))
    .must(builder.rangeQuery('created_at.epoch').lte(epoch))
    .must(builder.rangeQuery('number_of_library_items').gt(2));
  return builder
    .requestBodySearch()
    .query(builder.functionScoreQuery().query(mainQuery))
    .source(PLAYLIST_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export function getESQueryForPlaylistTopViewSearch(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
): builder.RequestBodySearch {
  const fields = ['description', 'hashtags', 'owner.name^4', 'title^4'];

  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('most_fields')))
        .functions([
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === SupportedLanguage.ENGLISH ? 7 : 23),
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('title.lowercase_keyword', keyword.toLowerCase()))
            .weight(deviceLang === SupportedLanguage.ENGLISH ? 20 : 17),
        ])
        .boostMode('sum')
        .scoreMode('sum'),
    )
    .source(PLAYLIST_SUMMARY_TOP_VIEW_FIELDS)
    .from(offset)
    .size(limit);
}

export async function getPlaylistSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'title',
    opStr: '==',
    value: keyword,
  });
  const conditionsForSort: FSSortCondition[] = [];
  const fieldMasks: string[] = PLAYLIST_SUMMARY_FIELDS;
  return getFirestoreDocuments(Collection.PLAYLISTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export async function getPlaylistSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
): Promise<ESSearchTransformResponse> {
  const esQuery = getPlaylistESQueryForRegularSearch(keyword, offset, limit);
  return getSingleIndexResultsFromES(ESIndex.PLAYLIST, esQuery);
}

export async function searchPlaylists(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`SearchPlayLists :: Query String ::  query :: is Required for Playlist Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const resultsFromES = await getPlaylistSearchResultsFromES(keyword, offset, limit);
  if (resultsFromES.total === 0) {
    const resultsFromFS = await getPlaylistSearchResultsFromFS(keyword, offset, limit);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
