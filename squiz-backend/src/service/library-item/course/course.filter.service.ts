import * as builder from 'elastic-builder';
// import path from 'path';
import { ParsedQs } from 'qs';
import { COURSE_SUMMARY_FIELDS } from '../../../model/library-item/library-item.model';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../../model/shared/elastic.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { ESIndex, ItemType, SupportedLanguage } from '../../../shared/enum';
// import logger from '../../../shared/logger';
import { booleanOrDefault, numberOrDefault } from '../../../utils/query-parameter-parser';
import filteringOptionsToESQueryArray from '../../shared/categorization.service';
import { getSingleIndexResultsFromES } from '../../shared/elastic.service';
import { validateAndReplaceWithEnglish } from '../../shared/i18n.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';
import { combineRequestedLanguages } from '../single-track/single-track.filter.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForCoursesFilter(
  deviceLang: string,
  offset: number,
  limit: number,
  queryParams: ParsedQs,
): builder.RequestBodySearch {
  const filter: string = queryParams.filter?.toString();
  const topics: string[] = queryParams.topics ? queryParams.topics.toString().split(',') : [];
  const sortOption = queryParams.sort_option?.toString().trim();
  const sortDirection = queryParams.sort_direction?.toString().trim();
  const ignoreLangs: boolean = booleanOrDefault(queryParams.ignore_langs?.toString().trim(), false);
  const publisherIds: string[] = queryParams.publisher_ids
    ? queryParams.publisher_ids?.toString().trim().split(',')
    : [];
  const ids: string[] = queryParams.ids ? queryParams.ids?.toString().split(',') : [];

  const queries: builder.Query[] = [];
  const languagesQuery = combineRequestedLanguages(
    queryParams.device_lang?.toString().trim(),
    queryParams.content_lang?.toString().trim(),
  );

  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .source(COURSE_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);

  const mainQuery = builder
    .boolQuery()
    .must(builder.matchAllQuery())
    .filter(builder.boolQuery().must(builder.termQuery('item_type.keyword', ItemType.COURSES)));

  const contextFilterQueries = filteringOptionsToESQueryArray(queryParams);
  for (let i = 0; i < contextFilterQueries.length; i += 1) {
    mainQuery.should(contextFilterQueries[i]);
  }

  if (contextFilterQueries.length > 0) {
    mainQuery.minimumShouldMatch(1);
  }
  queries.push(mainQuery);

  if (filter) {
    queries.push(builder.boolQuery().must(builder.matchQuery('filters.name', filter)));
  }
  if (topics.length) {
    queries.push(builder.termsQuery('topics.keyword', topics));
  }
  if (publisherIds.length) {
    queries.push(
      builder
        .boolQuery()
        .should(publisherIds.map((val): builder.MatchQuery => builder.matchQuery('publisher.id', val))),
    );
  }

  if (ids.length) {
    queries.push(builder.boolQuery().should(ids.map((val): builder.MatchQuery => builder.matchQuery('id', val))));
  }

  if (!ignoreLangs && languagesQuery && languagesQuery.length > 0) {
    queries.push(builder.boolQuery().should(languagesQuery));
  }
  if (sortOption) {
    switch (sortOption.toLowerCase()) {
      case 'highest_rated':
        reqBody.sort(builder.sort('rating_score', sortDirection || 'desc'));
        break;
      case 'newest':
        reqBody.sort(builder.sort('approved_at.iso_8601_datetime_tz', sortDirection || 'desc'));
        break;
      case 'popular':
        reqBody.sort(builder.sort('number_of_students', sortDirection || 'desc'));
        break;
      default:
        break;
    }
  }

  const finalQuery = builder
    .functionScoreQuery()
    .query(builder.boolQuery().must(queries))
    .functions([
      builder
        .weightScoreFunction()
        .filter(builder.termQuery('lang.iso_639_1', deviceLang))
        .weight(deviceLang === SupportedLanguage.ENGLISH ? 5 : 17),
      builder.weightScoreFunction().filter(builder.termQuery('item_type.keyword', ItemType.COURSES)).weight(10),
    ])
    .boostMode('sum')
    .scoreMode('sum')
    .boost(1.2);
  return reqBody.query(finalQuery);
}

export async function getCourseFilterResultsFromES(
  offset: number,
  limit: number,
  deviceLang: string,
  queryParams: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForCoursesFilter(deviceLang, offset, limit, queryParams);
  return getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery);
}

export async function filterCourses(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const deviceLang = validateAndReplaceWithEnglish([queryParams.device_lang?.toString().trim()])[0];
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const resultsFromES = await getCourseFilterResultsFromES(offset, limit, deviceLang, queryParams);
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
