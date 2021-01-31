import * as builder from 'elastic-builder';
// import path from 'path';
import { ParsedQs } from 'qs';
import { PlayListResponse, PLAYLIST_SUMMARY_FIELDS } from '../../model/playlist/playlist.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import {
  FSSearchCondition,
  FSSearchDOCSourceResponse,
  FSSearchTransformResponse,
  FSSortCondition,
} from '../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, FSWhereOperator } from '../../shared/enum';
// import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import transformToUnifiedSearchResults from '../shared/transform.service';
import getPlaylist from './playlist.get.service';

// const log = logger(path.relative(process.cwd(), __filename));

async function getRelatedPlaylistResultFromFS(
  conditionsForSearch: FSSearchCondition[],
  conditionsForSort: FSSortCondition[],
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  const fieldMasks: string[] = PLAYLIST_SUMMARY_FIELDS;
  return getFirestoreDocuments(Collection.PLAYLISTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export function getRelatedPlaylistESQuery(
  id: string,
  hashtags: string[],
  offset: number,
  limit: number,
): builder.RequestBodySearch {
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(PLAYLIST_SUMMARY_FIELDS);
  const queries: builder.Query[] = [];
  queries.push(builder.rangeQuery('number_of_library_items').gte(3));
  const mainQuery = builder.boolQuery().mustNot(builder.termQuery('id.keyword', id));
  queries.push(mainQuery);
  if (hashtags) {
    queries.push(
      builder
        .boolQuery()
        .must(hashtags.map((val): builder.MatchQuery => builder.matchQuery('hashtags', val.toLowerCase()))),
    );
  }
  reqBody.sort(builder.sort('number_of_followers', 'desc'));
  const finalBool = builder.boolQuery().must(queries);
  return reqBody.query(finalBool);
}

export function getPopularPlaylistESQuery(id: string, offset: number, limit: number): builder.RequestBodySearch {
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(PLAYLIST_SUMMARY_FIELDS);
  reqBody.sort(builder.sort('number_of_followers', 'desc'));
  const finalBool = builder.boolQuery().must(builder.boolQuery().mustNot(builder.termQuery('id.keyword', id)));
  return reqBody.query(finalBool);
}

export function getPubliherPlaylistFromESQuery(offset: number, limit: number): builder.RequestBodySearch {
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(PLAYLIST_SUMMARY_FIELDS);
  const queries: builder.Query[] = [];
  queries.push();
  const mainQuery = builder.boolQuery().must(builder.termQuery('owner.is_publisher', true));
  queries.push(mainQuery);
  reqBody.sort(builder.sort('number_of_followers', 'desc'));
  const finalBool = builder.boolQuery().must(queries);
  return reqBody.query(finalBool);
}

export async function getRelatedPlaylistResultsFromES(
  playlistId: string,
  queryParams: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const playlist: PlayListResponse = (await getPlaylist(playlistId)) as PlayListResponse;
  const { id, hashtags } = playlist;
  if (hashtags && hashtags.length) {
    let esQuery = getRelatedPlaylistESQuery(id, hashtags, offset, limit);
    let esResult = await getSingleIndexResultsFromES(
      ESIndex.PLAYLIST,

      esQuery,
    );
    const { items } = esResult;
    if (items.length < limit) {
      // Note : if related playlist is less than limit then we are concatinating playlist of popular publisher
      const newLimit = limit - esResult.items.length;
      esQuery = getPubliherPlaylistFromESQuery(0, newLimit);
      esResult = await getSingleIndexResultsFromES(ESIndex.PLAYLIST, esQuery);
      return Promise.resolve({ total: limit, items: [...items, ...esResult.items] });
    }
    return Promise.resolve(esResult);
  }
  const esQuery = getPopularPlaylistESQuery(id, 0, limit);
  return getSingleIndexResultsFromES(ESIndex.PLAYLIST, esQuery);
}

export async function getRelatedPlaylistResultsFS(
  playlistId: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  let conditionsForSearch: FSSearchCondition[] = [];
  const playlist: PlayListResponse = (await getPlaylist(playlistId)) as PlayListResponse;
  const { hashtags } = playlist;
  if (hashtags && hashtags.length > 0) {
    let conditionsForSort = new Array<FSSortCondition>();
    conditionsForSort.push({ fieldPath: 'number_of_followers', directionStr: 'desc' });
    conditionsForSearch = [];
    conditionsForSearch.push({
      fieldPath: 'hashtags',
      opStr: FSWhereOperator.ARRAY_CONTAINS_ANY,
      value: hashtags,
    });
    const fsResponse = await getRelatedPlaylistResultFromFS(conditionsForSearch, conditionsForSort, offset, limit);
    let { items } = fsResponse;
    items = items.filter((e: FSSearchDOCSourceResponse): boolean => {
      const element = e as PlayListResponse;
      return !!(element.number_of_library_items && element.number_of_library_items > 2) && element.id !== playlistId;
    });
    if (items.length < limit) {
      conditionsForSort = new Array<FSSortCondition>();
      conditionsForSort.push({ fieldPath: 'owner.number_of_followers', directionStr: 'desc' });
      conditionsForSearch = [];
      conditionsForSearch.push({
        fieldPath: 'owner.is_publisher',
        opStr: FSWhereOperator.EQUAL_TO,
        value: true,
      });
      const res = await getRelatedPlaylistResultFromFS(
        conditionsForSearch,
        conditionsForSort,
        offset,
        limit - items.length,
      );
      items.concat(res.items);
      return Promise.resolve({ total: items.length, items });
    }
    return Promise.resolve({ total: items.length, items });
  }
  return Promise.resolve({ total: 0, items: [] });
}

export async function relatedPlaylists(
  playlistId: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const resultsFromES = await getRelatedPlaylistResultsFromES(playlistId, queryParams);
  if (resultsFromES.total === 0) {
    const resultsFromFS = await getRelatedPlaylistResultsFS(playlistId, offset, limit);
    return { total: resultsFromFS.total, items: transformToUnifiedSearchResults(resultsFromFS.items) };
  }
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
