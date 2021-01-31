import * as builder from 'elastic-builder';
import lodash from 'lodash';
import path from 'path';
import { ParsedQs } from 'qs';
import { JsonObject } from 'swagger-ui-express';
import {
  COURSE_SUMMARY_FIELDS,
  DAILY_INSIGHT_ITEM_SUMMARY_FIELDS,
  LIBRARY_ITEM_SUMMARY_FIELDS,
  LIBRARY_ITEM_SUMMARY_TOP_VIEW_FIELDS,
  SINGLE_TRACK_SUMMARY_FIELDS,
} from '../../model/library-item/library-item.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchDOCSourceResponse, ESSearchTransformResponse } from '../../model/shared/elastic.model';
import {
  FSSearchCondition,
  FSSearchDOCSourceResponse,
  FSSearchTransformResponse,
  FSSortCondition,
} from '../../model/shared/firestore.model';
import { Collection, ESIndex, FSWhereOperator, ItemType, SupportedLanguage } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
import logger from '../../shared/logger';
import { booleanOrDefault, numberOrDefault } from '../../utils/query-parameter-parser';
import filteringOptionsToESQueryArray from '../shared/categorization.service';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import { validateAndReplaceWithEnglish } from '../shared/i18n.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

const log = logger(path.relative(process.cwd(), __filename));

const DEFAULT_PAGE_SIZE = 20;

export function getESQueryForAudioSearch(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
  singleTrackOnly: boolean,
  queryParams?: ParsedQs,
): builder.RequestBodySearch {
  const matchFields = [
    'title^3',
    'learn_description',
    'content_type',
    'publisher.name^2',
    'long_description',
    'short_description',
  ];
  const weightFields = ['title^3', 'short_description'];
  const mainQuery = builder
    .boolQuery()
    .must(builder.multiMatchQuery(matchFields, keyword).fuzziness(2).type('most_fields'));
  if (singleTrackOnly) {
    mainQuery.must(builder.termQuery('item_type.keyword', ItemType.SINGLE_TRACKS));
  }
  const contextFilterQueries = filteringOptionsToESQueryArray(queryParams);
  for (let i = 0; i < contextFilterQueries.length; i += 1) {
    mainQuery.should(contextFilterQueries[i]);
  }
  if (contextFilterQueries.length > 0) {
    mainQuery.minimumShouldMatch(1);
  }
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === SupportedLanguage.ENGLISH ? 20 : 30),
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('item_type.keyword', ItemType.DAILY_INSIGHT))
            .weight(10),
          builder.weightScoreFunction().filter(builder.termQuery('item_type.keyword', ItemType.COURSES)).weight(20),
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('item_type.keyword', ItemType.SINGLE_TRACKS))
            .weight(30),
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(2).type('most_fields'))
            .weight(10),
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(1).type('most_fields'))
            .weight(20),
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(0).type('most_fields'))
            .weight(30),
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('title.lowercase_keyword', keyword.toLowerCase()))
            .weight(50),
          builder.scriptScoreFunction(builder.script('inline', `_score * doc['play_count'].value / 7000000`)),
        ])
        .boostMode('sum')
        .scoreMode('sum'),
    )
    .source([...COURSE_SUMMARY_FIELDS, ...DAILY_INSIGHT_ITEM_SUMMARY_FIELDS, ...SINGLE_TRACK_SUMMARY_FIELDS])
    .from(offset)
    .size(limit);
}

export function getESQueryForAudioTopViewSearch(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
  singleTrackOnly: boolean,
  queryParams?: ParsedQs,
): builder.RequestBodySearch {
  const matchFields = [
    'title^2',
    'learn_description',
    'content_type',
    'publisher.name^2',
    'long_description',
    'short_description',
  ];
  const weightFields = ['title^3', 'short_description'];
  const mainQuery = builder
    .boolQuery()
    .must(builder.multiMatchQuery(matchFields, keyword).fuzziness(2).type('most_fields'))
    .mustNot(builder.termQuery('item_type.keyword', ItemType.DAILY_INSIGHT));
  if (singleTrackOnly) {
    mainQuery.mustNot(builder.termQuery('item_type.keyword', ItemType.COURSES));
  }
  const contextFilterQueries = filteringOptionsToESQueryArray(queryParams);
  for (let i = 0; i < contextFilterQueries.length; i += 1) {
    mainQuery.should(contextFilterQueries[i]);
  }
  if (contextFilterQueries.length > 0) {
    mainQuery.minimumShouldMatch(1);
  }
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === SupportedLanguage.ENGLISH ? 20 : 30),
          builder.weightScoreFunction().filter(builder.termQuery('item_type.keyword', ItemType.COURSES)).weight(20),
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('item_type.keyword', ItemType.SINGLE_TRACKS))
            .weight(30),
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(weightFields, keyword).fuzziness(2).type('most_fields'))
            .weight(10),
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(matchFields, keyword).fuzziness(1).type('most_fields'))
            .weight(20),
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(matchFields, keyword).fuzziness(0).type('most_fields'))
            .weight(30),
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('title.lowercase_keyword', keyword.toLowerCase()))
            .weight(50),
          builder.scriptScoreFunction(builder.script('inline', `_score * doc['play_count'].value / 7000000`)),
        ])
        .boostMode('sum')
        .scoreMode('sum'),
    )
    .source(LIBRARY_ITEM_SUMMARY_TOP_VIEW_FIELDS)
    .from(offset)
    .size(limit);
}

function transformResponse(response: ESSearchTransformResponse | FSSearchTransformResponse): JsonObject[] {
  const filteredRecords: JsonObject[] = [];
  response.items.forEach((item: JsonObject): void => {
    if (item.item_type === ItemType.COURSES) {
      filteredRecords.push({
        ...lodash.pick(item, COURSE_SUMMARY_FIELDS),
        search_result_type: item.search_result_type,
      });
    } else if (item.item_type === ItemType.DAILY_INSIGHT) {
      filteredRecords.push({
        ...lodash.pick(item, DAILY_INSIGHT_ITEM_SUMMARY_FIELDS),
        search_result_type: item.search_result_type,
      });
    } else {
      filteredRecords.push({
        ...lodash.pick(item, SINGLE_TRACK_SUMMARY_FIELDS),
        search_result_type: item.search_result_type,
      });
    }
  });
  return filteredRecords;
}

export async function getAudioSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
  singleTrackOnly: boolean,
  queryParams: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForAudioSearch(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams);
  const response = await getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery);
  return { total: response.total, items: transformResponse(response) as ESSearchDOCSourceResponse[] };
}

export async function getAudioSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'title',
    opStr: FSWhereOperator.EQUAL_TO,
    value: keyword,
  });
  const conditionsForSort: FSSortCondition[] = [];
  const fieldMasks: string[] = LIBRARY_ITEM_SUMMARY_FIELDS;
  const response = await getFirestoreDocuments(
    Collection.LIBRARY_ITEMS,
    conditionsForSearch,
    conditionsForSort,
    offset,
    limit,
    fieldMasks,
  );
  return { total: response.total, items: transformResponse(response) as FSSearchDOCSourceResponse[] };
}

export async function searchAudio(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`SearchAudio :: query :: is Required for Audio Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const deviceLang = validateAndReplaceWithEnglish([queryParams.device_lang?.toString().trim()])[0];
  const singleTrackOnly = booleanOrDefault(queryParams.single_tracks_only, false);
  try {
    const resultsFromES = await getAudioSearchResultsFromES(
      keyword,
      offset,
      limit,
      deviceLang,
      singleTrackOnly,
      queryParams,
    );
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    log.error(`SearchAudio:: ${error}`);
    const resultsFromFS = await getAudioSearchResultsFromFS(keyword, offset, limit);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
}
