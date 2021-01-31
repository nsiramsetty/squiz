import * as builder from 'elastic-builder';
import path from 'path';
import { ParsedQs } from 'qs';
import { COURSE_SUMMARY_FIELDS } from '../../../model/library-item/library-item.model';
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
import { validateAndReplaceWithEnglish } from '../../shared/i18n.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';

const log = logger(path.relative(process.cwd(), __filename));

export function courseQueryForTopView(
  deviceLang: string,
  keyword: string,
  offset: number,
  limit: number,
  fieldMasks?: string[],
): builder.RequestBodySearch {
  const fields = ['title^2', 'content_type', 'publisher.name^2', 'long_description', 'short_description'];
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(
          builder
            .boolQuery()
            .must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('most_fields'))
            .must(builder.termQuery('item_type.keyword', ItemType.COURSES)),
        )
        .functions([
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
        ])
        .boostMode('sum')
        .scoreMode('sum')
        .boost(1.2),
    )
    .source(
      fieldMasks || [
        'id',
        'title',
        'picture',
        'title_html',
        'minutes_per_day',
        'days',
        'publisher',
        'lang',
        'item_type',
        'purchase_tier',
        'web_url',
      ],
    )
    .from(offset)
    .size(limit);
}

export function getESQueryForCoursesRegularSearch(
  deviceLang: string,
  keyword: string,
  offset: number,
  limit: number,
  queryParams: ParsedQs,
): builder.RequestBodySearch {
  const fields = ['title^2', 'content_type', 'publisher.name^2', 'long_description', 'short_description'];
  const mainQuery = builder
    .boolQuery()
    .must(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('most_fields'))
    .must(builder.termQuery('item_type.keyword', ItemType.COURSES));
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
        .function(builder.weightScoreFunction().filter(builder.termQuery('lang.iso_639_1', deviceLang)).weight(2)),
    )
    .source(COURSE_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export async function getCourseSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'item_type',
    opStr: FSWhereOperator.EQUAL_TO,
    value: 'COURSES',
  });
  conditionsForSearch.push({
    fieldPath: 'title',
    opStr: FSWhereOperator.EQUAL_TO,
    value: keyword,
  });

  const conditionsForSort: FSSortCondition[] = [];

  const fieldMasks: string[] = COURSE_SUMMARY_FIELDS;
  return getFirestoreDocuments(
    Collection.LIBRARY_ITEMS,
    conditionsForSearch,
    conditionsForSort,
    offset,
    limit,
    fieldMasks,
  );
}

export async function getCourseSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
  queryParams: ParsedQs,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForCoursesRegularSearch(deviceLang, keyword, offset, limit, queryParams);
  return getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery);
}

export async function searchCourses(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const deviceLang = validateAndReplaceWithEnglish([queryParams.device_lang?.toString().trim()])[0];
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error('Query is Required for Search.');
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);

  try {
    const resultsFromES = await getCourseSearchResultsFromES(keyword, offset, limit, deviceLang, queryParams);
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    log.error(`searchCourses:: ${error}`);
    const resultsFromFS = await getCourseSearchResultsFromFS(keyword, offset, limit);
    return { total: resultsFromFS.total, items: transformToUnifiedSearchResults(resultsFromFS.items) };
  }
}
