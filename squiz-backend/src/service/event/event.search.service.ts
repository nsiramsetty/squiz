import * as builder from 'elastic-builder';
import moment from 'moment';
// import path from 'path';
import { ParsedQs } from 'qs';
import { EVENT_SUMMARY_FIELDS } from '../../model/event/event.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, EventPrivacy, EventStatus, EventType, FSWhereOperator } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
// import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForEventsRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
): builder.RequestBodySearch {
  const fields = ['title', 'description', 'owner.name'];
  const epoch = moment.utc().add(moment.duration(0, 'minutes')).valueOf();
  const mainQuery = builder.boolQuery().must([
    builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'),
    builder.matchQuery('status.keyword', EventStatus.APPROVED),
    builder.matchQuery('privacy.keyword', EventPrivacy.PUBLIC),
    builder.matchQuery('type.keyword', EventType.LIVE_STREAM),
    builder
      .boolQuery()
      .should([
        builder.boolQuery().must(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(epoch)),
        builder
          .boolQuery()
          .must([
            builder.rangeQuery('_next_occurrences.start_date.epoch').lte(epoch),
            builder.rangeQuery('_next_occurrences.end_date.epoch').gte(epoch),
          ]),
      ])
      .minimumShouldMatch(1),
  ]);
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
          builder.weightScoreFunction().filter(builder.matchQuery('title.keyword', keyword)).weight(50),
          builder.weightScoreFunction().filter(builder.multiMatchQuery(fields, keyword).fuzziness(0)).weight(20),
          builder.weightScoreFunction().filter(builder.multiMatchQuery(fields, keyword).fuzziness(1)).weight(10),
        ])
        .scoreMode('sum'),
    )
    .source(EVENT_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export function getESQueryFoEventsTopViewSearch(
  keyword: string,
  offset: number,
  limit: number,
): builder.RequestBodySearch {
  const epoch = moment.utc().add(moment.duration(0, 'minutes')).valueOf();
  const fields = ['title', 'description', 'owner.name'];
  const mainQuery = builder.boolQuery().must([
    builder.multiMatchQuery(fields, keyword).fuzziness(1).type('best_fields'),
    builder.matchQuery('status.keyword', EventStatus.APPROVED),
    builder.matchQuery('privacy.keyword', EventPrivacy.PUBLIC),
    builder.matchQuery('type.keyword', EventType.LIVE_STREAM),
    builder
      .boolQuery()
      .should([
        builder.boolQuery().must(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(epoch)),
        builder
          .boolQuery()
          .must([
            builder.rangeQuery('_next_occurrences.start_date.epoch').lte(epoch),
            builder.rangeQuery('_next_occurrences.end_date.epoch').gte(epoch),
          ]),
      ])
      .minimumShouldMatch(1),
  ]);
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
          builder.weightScoreFunction().filter(builder.termQuery('title.keyword', keyword)).weight(20),
          builder.weightScoreFunction().filter(builder.termQuery('title.keyword', keyword)).weight(10),
        ]),
    )
    .source(EVENT_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export async function getEventSearchResultsFromFS(
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
  const fieldMasks: string[] = EVENT_SUMMARY_FIELDS;
  return getFirestoreDocuments(Collection.EVENTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export async function getEventsSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForEventsRegularSearch(keyword, offset, limit);
  return getSingleIndexResultsFromES(ESIndex.EVENT, esQuery);
}

export async function searchEvents(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`searchEvents :: query :: is Required for Events Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  try {
    const resultsFromES = await getEventsSearchResultsFromES(keyword, offset, limit);
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const resultsFromFS = await getEventSearchResultsFromFS(keyword, offset, limit);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
}
