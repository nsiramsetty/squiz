import * as builder from 'elastic-builder';
import path from 'path';
import { ParsedQs } from 'qs';
import {
  SINGLE_TRACK_SUMMARY_FIELDS,
  SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS,
} from '../../../model/library-item/library-item.model';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { Collection, ESIndex, FSWhereOperator, ItemType, SupportedLanguage } from '../../../shared/enum';
import HTTP400Error from '../../../shared/http/http-400-error';
import logger from '../../../shared/logger';
import { numberOrDefault } from '../../../utils/query-parameter-parser';
import filteringOptionsToESQueryArray from '../../shared/categorization.service';
import { getSingleIndexResultsFromES } from '../../shared/elastic.service';
import { getFirestoreDocuments } from '../../shared/firestore.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';

const log = logger(path.relative(process.cwd(), __filename));

export function libraryItemQueryForTopView(
  deviceLang: string,
  keyword: string,
  offset: number,
  limit: number,
  queryParams: ParsedQs,
): builder.RequestBodySearch {
  const fields = ['title^2', 'content_type', 'publisher.name', 'long_description', 'short_description'];
  const boolQuery = builder
    .boolQuery()
    .must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('most_fields'))
    .must(builder.termQuery('item_type.keyword', ItemType.SINGLE_TRACKS));
  const contextFilterQueries = filteringOptionsToESQueryArray(queryParams);
  for (let i = 0; i < contextFilterQueries.length; i += 1) {
    boolQuery.should(contextFilterQueries[i]);
  }
  if (contextFilterQueries.length > 0) {
    boolQuery.minimumShouldMatch(1);
  }
  const scoreFunctions = [
    builder
      .weightScoreFunction()
      .filter(builder.termQuery('lang.iso_639_1', deviceLang))
      .weight(deviceLang === SupportedLanguage.ENGLISH ? 10 : 20),
    builder
      .weightScoreFunction()
      .filter(builder.multiMatchQuery(fields, keyword).fuzziness(0).type('most_fields'))
      .weight(20),
    builder
      .weightScoreFunction()
      .filter(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('most_fields'))
      .weight(5),
    builder.scriptScoreFunction(builder.script('inline', `_score * doc['play_count'].value / 7000000`)),
  ];
  return builder
    .requestBodySearch()
    .query(builder.functionScoreQuery().query(boolQuery).functions(scoreFunctions).boostMode('sum').scoreMode('sum'))
    .source(SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS)
    .from(offset)
    .size(limit);
}

export function getESQueryForSingleTracksRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
  queryParams?: ParsedQs,
): builder.RequestBodySearch {
  const fields = ['title^2', 'short_description', 'long_description', 'publisher.name'];
  const mainQuery = builder.boolQuery().must(builder.termQuery('item_type.keyword', ItemType.SINGLE_TRACKS));

  if (keyword.indexOf(' ') >= 0) {
    mainQuery.must(builder.multiMatchQuery(fields, keyword).type('best_fields'));
  } else {
    mainQuery.must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'));
  }

  const contextFilterQueries = filteringOptionsToESQueryArray(queryParams);
  contextFilterQueries.forEach((contextFilterQuery): void => {
    mainQuery.should(contextFilterQuery);
  });
  if (contextFilterQueries.length > 0) {
    mainQuery.minimumShouldMatch(1);
  }

  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(mainQuery)
        .function(builder.weightScoreFunction().filter(builder.termQuery('lang.iso_639_1', deviceLang)).weight(2))
        .function(builder.fieldValueFactorFunction().field('play_count').factor(0.1).modifier('log1p').missing(1)),
    )
    .source(SINGLE_TRACK_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export async function getSingleTrackSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'item_type',
    opStr: FSWhereOperator.EQUAL_TO,
    value: 'SINGLE_TRACKS',
  });
  conditionsForSearch.push({
    fieldPath: 'title',
    opStr: FSWhereOperator.EQUAL_TO,
    value: keyword,
  });
  const conditionsForSort: FSSortCondition[] = [];
  const fieldMasks: string[] = SINGLE_TRACK_SUMMARY_FIELDS;
  return getFirestoreDocuments(
    Collection.LIBRARY_ITEMS,
    conditionsForSearch,
    conditionsForSort,
    offset,
    limit,
    fieldMasks,
    undefined,
    true,
  );
}

export async function getSingleTrackSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
  queryParams: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForSingleTracksRegularSearch(keyword, offset, limit, deviceLang, queryParams);
  return getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery, true);
}

export async function searchSingleTracks(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`SearchSingleTracks :: query :: is Required for Library Items Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const deviceLang = queryParams.device_lang?.toString().trim();
  if (!deviceLang) {
    throw new HTTP400Error(`SearchSingleTracks :: device_lang :: is Required for Library Items Search.`);
  }
  try {
    const resultsFromES = await getSingleTrackSearchResultsFromES(keyword, offset, limit, deviceLang, queryParams);
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    log.error(error);
    const resultsFromFS = await getSingleTrackSearchResultsFromFS(keyword, offset, limit);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
}
