import * as builder from 'elastic-builder';
import * as _ from 'lodash';
// import path from 'path';
import { ParsedQs } from 'qs';
import { DAILY_INSIGHT_ITEM_SUMMARY_FIELDS } from '../../../model/library-item/library-item.model';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../../model/shared/elastic.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { DailyInsightType, ESIndex } from '../../../shared/enum';
// import logger from '../../../shared/logger';
import { numberOrDefault } from '../../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../../shared/elastic.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function combineRequestedLanguages(deviceLang: string, contentLang: string | string[]): builder.MatchQuery[] {
  let requestedLang: string[] = [];
  if (typeof contentLang === 'string') {
    if (contentLang && contentLang.trim() !== '') {
      contentLang
        .split(',')
        .filter((l): boolean => l.trim() !== '')
        .map((l): string => l.trim())
        .forEach((l): number => requestedLang.push(l));
    }
  } else if (Array.isArray(contentLang)) {
    requestedLang = contentLang;
  }
  // device lang should not be added to the search request.
  // it should only help boost the results if the device lang matches one of the content Lang
  // so i'm pushing the device lang to the top of the array so it has a higher boost factor.
  if (requestedLang.indexOf(deviceLang) > -1) {
    requestedLang.unshift(deviceLang);
  }
  requestedLang = _.uniq(requestedLang);
  let boostFactor = 32;
  const requestedLangQueries = requestedLang.map(
    (l): builder.MatchQuery => {
      const query = new builder.MatchQuery('lang.iso_639_1', l);
      boostFactor = boostFactor / 2 || 1;
      return query;
    },
  );
  if (requestedLangQueries.length === 0) {
    const query = new builder.MatchQuery('lang.iso_639_1', 'en');
    requestedLangQueries.push(query);
  }
  return requestedLangQueries;
}

export function getDailyInsightESQuery(queryParams: ParsedQs): builder.RequestBodySearch {
  const type = queryParams.type?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const languagesQuery: builder.MatchQuery[] = combineRequestedLanguages(
    queryParams.device_lang?.toString().trim(),
    queryParams.content_lang?.toString().trim(),
  );
  const sortOption = queryParams.sort_option?.toString().trim();
  const sortDirection = queryParams.sort_direction?.toString().trim();
  const publisherId = queryParams.publisher_id?.toString().trim();
  const today = new Date().toISOString().substr(0, 10);
  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(DAILY_INSIGHT_ITEM_SUMMARY_FIELDS);

  const dateQuery =
    type === DailyInsightType.CURRENT
      ? builder.rangeQuery('calendar_id').lte(today)
      : builder.rangeQuery('calendar_id').gte(today);

  queries.push(builder.boolQuery().must(dateQuery));
  const filteredQuery = builder
    .boolQuery()
    .must(builder.matchAllQuery())
    .filter(builder.boolQuery().must(builder.termQuery('item_type.keyword', 'DAILY_INSIGHT')));
  queries.push(filteredQuery);
  queries.push(builder.boolQuery().should(languagesQuery));

  if (sortOption) {
    switch (sortOption.toLowerCase()) {
      case 'latest':
        reqBody.sort(builder.sort('calendar_id', sortDirection || 'desc'));
        break;
      default:
        reqBody.sort(builder.sort('calendar_id', sortDirection || 'desc'));
    }
  } else {
    reqBody.sort(builder.sort('calendar_id', sortDirection || 'desc'));
  }

  if (publisherId) {
    const publisherIdQuery = builder.boolQuery().must(builder.matchQuery('publisher.id', publisherId));
    queries.push(publisherIdQuery);
  }

  const finalBool: builder.BoolQuery = builder.boolQuery().must(queries);
  return reqBody.query(finalBool);
}

export async function getDailyInsightFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getDailyInsightESQuery(queryParams);
  return getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery);
}

export async function filterDailyInsight(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const resultsFromES = await getDailyInsightFilterResultsFromES(queryParams);
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
