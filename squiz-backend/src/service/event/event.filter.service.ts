import * as builder from 'elastic-builder';
import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import { ParsedQs } from 'qs';
import {
  EventContentFilterMapping,
  EventOccurrence,
  EVENT_SUMMARY_FIELDS,
  OCCURRENCE_SUMMARY_FIELDS,
} from '../../model/event/event.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, EventPrivacy, EventStatus, FSWhereOperator, SupportedLanguage } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
import logger from '../../shared/logger';
import { booleanOrDefault, checkIsDecimal, numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import { getCombinedLanguages } from '../shared/i18n.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

const log = logger(path.relative(process.cwd(), __filename));

export function getEventESQueryForRegularFilter(queryParams: ParsedQs): builder.RequestBodySearch {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const epoch = moment.utc().valueOf();
  const include_all_privacy: boolean = booleanOrDefault(queryParams.include_all_privacy, false);
  const include_all_status: boolean = booleanOrDefault(queryParams.include_all_status, false);
  const geo_distance: string = queryParams.geo_distance?.toString().trim();
  const geo_pin: string = queryParams.geo_pin?.toString().trim();
  const sort_option: string = queryParams.sort_option?.toString().trim();
  const sort_direction: string = queryParams.sort_direction?.toString().trim();
  const hashtags = queryParams.hashtags?.toString().trim();
  const contentFilters = queryParams.content_filters?.toString().trim();
  const content_types = queryParams.content_types?.toString().trim();
  const occurrence_types = queryParams.occurrence_types?.toString().trim();
  const owner_ids = queryParams.owner_ids?.toString().trim();
  const type = queryParams.type?.toString().trim();
  const languages = getCombinedLanguages(
    queryParams.device_lang?.toString().trim(),
    queryParams.content_langs?.toString().trim(),
  );
  const startDateFrom = queryParams.start_date_from?.toString().trim();
  const startDateTo = queryParams.start_date_to?.toString().trim();
  const endDateFrom = queryParams.end_date_from?.toString().trim();
  const endDateTo = queryParams.end_date_to?.toString().trim();
  const queries: builder.Query[] = [];
  const functionQueries: builder.WeightScoreFunction[] = [];

  const fromTime = moment().subtract('2', 'hours').utc().valueOf();
  const toTime = moment().add('2', 'hours').utc().valueOf();
  const upcomingTime = moment().add('5', 'days').utc().valueOf();
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(EVENT_SUMMARY_FIELDS);
  if (sort_option || sort_direction) {
    switch (sort_option.toLowerCase()) {
      case 'start_date':
        reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', sort_direction || 'asc'));
        break;
      case 'end_date':
        reqBody.sort(builder.sort('_next_occurrences.end_date.epoch', sort_direction || 'asc'));
        break;
      default:
        reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', sort_direction || 'asc'));
        break;
    }
  } else {
    reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', sort_direction || 'asc'));
  }

  if (keyword) {
    const matchQuery = builder.multiMatchQuery(['title', 'description'], keyword);
    queries.push(builder.boolQuery().must(matchQuery));
  }

  if (type) {
    queries.push(builder.boolQuery().must(builder.matchQuery('type.keyword', type)));
  }

  if (!include_all_status) {
    queries.push(builder.boolQuery().must(builder.matchQuery('status.keyword', EventStatus.APPROVED)));
  }

  if (!include_all_privacy) {
    queries.push(builder.boolQuery().must(builder.matchQuery('privacy.keyword', EventPrivacy.PUBLIC)));
  }

  if (hashtags && hashtags.trim() !== '') {
    const hashtags_array: string[] = hashtags.split(',');
    if (hashtags_array.length > 0) {
      queries.push(
        builder
          .boolQuery()
          .should(hashtags_array.map((val): builder.MatchQuery => builder.matchQuery('hashtags.keyword', val)))
          .minimumShouldMatch(1),
      );
    }
  }

  if (contentFilters && contentFilters.trim() !== '') {
    const filter_array: string[] = contentFilters.split(',');
    if (filter_array.length > 0) {
      let hashtagsList: string[] = [];
      filter_array.forEach((content_filter): void => {
        if (EventContentFilterMapping[content_filter]) {
          hashtagsList = hashtagsList.concat(EventContentFilterMapping[content_filter]);
        }
      });
      if (hashtagsList.length > 0) {
        queries.push(
          builder
            .boolQuery()
            .should(
              hashtagsList.map(
                (val: string): builder.MatchQuery => {
                  return builder.matchQuery('hashtags.keyword', val);
                },
              ),
            )
            .minimumShouldMatch(1),
        );
      }
    }
  }

  if (content_types && content_types.trim() !== '') {
    const content_types_array: string[] = content_types.split(',');
    if (content_types_array.length > 0) {
      queries.push(
        builder
          .boolQuery()
          .should(
            content_types_array.map(
              (val): builder.MatchQuery => builder.matchQuery('_next_occurrences.broadcast_summary.content_type', val),
            ),
          )
          .minimumShouldMatch(1),
      );
    }
  }

  if (owner_ids && owner_ids.trim() !== '') {
    const owner_ids_array: string[] = owner_ids.split(',');
    if (owner_ids_array.length > 0) {
      queries.push(
        builder
          .boolQuery()
          .should(owner_ids_array.map((val): builder.MatchQuery => builder.matchQuery('owner.id', val)))
          .minimumShouldMatch(1),
      );
    }
  }

  if (occurrence_types && occurrence_types.trim() !== '') {
    const occurrence_types_array: string[] = occurrence_types.split(',');
    if (occurrence_types_array.length > 0) {
      const event_type_queries: builder.Query | builder.Query[] = [];
      occurrence_types_array.forEach((event_type): void => {
        switch (event_type.toLowerCase()) {
          case 'future':
            event_type_queries.push(builder.rangeQuery('_next_occurrences.start_date.epoch').gt(epoch));
            break;
          case 'past':
            event_type_queries.push(builder.rangeQuery('_next_occurrences.end_date.epoch').lt(epoch));
            break;
          case 'live':
            event_type_queries.push(
              builder
                .boolQuery()
                .must([
                  builder.rangeQuery('_next_occurrences.start_date.epoch').lte(epoch),
                  builder.rangeQuery('_next_occurrences.end_date.epoch').gte(epoch),
                ]),
            );
            break;
          case 'live_stories':
            event_type_queries.push(
              builder
                .boolQuery()
                .must([
                  builder.rangeQuery('_next_occurrences.start_date.epoch').lte(toTime),
                  builder.rangeQuery('_next_occurrences.start_date.epoch').gte(fromTime),
                ]),
            );
            break;
          case 'upcoming_soon':
            event_type_queries.push(
              builder
                .boolQuery()
                .must([
                  builder.rangeQuery('_next_occurrences.start_date.epoch').lte(upcomingTime),
                  builder.rangeQuery('_next_occurrences.start_date.epoch').gte(toTime),
                ]),
            );
            break;
          default:
            break;
        }
      });
      if (event_type_queries.length > 0) {
        queries.push(builder.boolQuery().should(event_type_queries).minimumShouldMatch(1));
      }
    }
  }

  /* if (languages.length) {
    languages.forEach((lang): void => {
      functionQueries.push(builder.weightScoreFunction().filter(builder.termQuery('lang.iso_639_1', lang)).weight(100));
    });
  } */

  // as per cyrus suggestion to temporary add english as if languages doesn't contain english
  if (languages.length > 0 && languages.indexOf(SupportedLanguage.ENGLISH) === -1) {
    languages.push(SupportedLanguage.ENGLISH);
  }

  if (languages.length > 0) {
    queries.push(
      builder
        .boolQuery()
        .should(languages.map((val): builder.MatchQuery => builder.matchQuery('lang.iso_639_1', val)))
        .minimumShouldMatch(1),
    );
  }

  if (geo_pin) {
    const geoPinPoints = geo_pin.split(',');
    queries.push(
      builder.boolQuery().filter(
        builder
          .geoDistanceQuery(
            'owner.region.location',
            builder.geoPoint().object({
              lon: geoPinPoints[0],
              lat: geoPinPoints[1],
            }),
          )
          .distance(geo_distance),
      ),
    );
  }
  if (startDateFrom && checkIsDecimal(startDateFrom)) {
    queries.push(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(startDateFrom));
  }
  if (startDateTo && checkIsDecimal(startDateTo)) {
    queries.push(builder.rangeQuery('_next_occurrences.start_date.epoch').lte(startDateTo));
  }
  if (endDateFrom && checkIsDecimal(endDateFrom)) {
    queries.push(builder.rangeQuery('_next_occurrences.end_date.epoch').gte(endDateFrom));
  }
  if (endDateTo && checkIsDecimal(endDateTo)) {
    queries.push(builder.rangeQuery('_next_occurrences.end_date.epoch').lte(endDateTo));
  }
  return reqBody.query(
    builder
      .functionScoreQuery()
      .query(builder.boolQuery().must(queries))
      .functions(functionQueries)
      .boostMode('sum')
      .scoreMode('sum'),
  );
}

export async function getEventsFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getEventESQueryForRegularFilter(queryParams);
  return getSingleIndexResultsFromES(ESIndex.EVENT, esQuery);
}

export async function getEventFilterResultsFromFS(queryParams: ParsedQs): Promise<FSSearchTransformResponse> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const type = queryParams.type?.toString().trim();
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'type',
    opStr: FSWhereOperator.EQUAL_TO,
    value: type,
  });
  conditionsForSearch.push({
    fieldPath: 'title',
    opStr: FSWhereOperator.EQUAL_TO,
    value: keyword,
  });

  const conditionsForSort: FSSortCondition[] = [];
  const fieldMasks: string[] = EVENT_SUMMARY_FIELDS;

  return getFirestoreDocuments(Collection.EVENTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export async function filterEvents(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const type: string | undefined = queryParams.type?.toString().trim();
  if (!type) {
    throw new HTTP400Error(`Filter Events :: type :: is Required for Events Filter.`);
  }
  try {
    const resultsFromES = await getEventsFilterResultsFromES(queryParams);
    const resultsFromESItems = resultsFromES.items;
    resultsFromESItems.forEach((item): void => {
      const nextOccurrences = item._next_occurrences?.map(
        (x): EventOccurrence => {
          const occurrence = _.pick(x, OCCURRENCE_SUMMARY_FIELDS);
          return occurrence as EventOccurrence;
        },
      );
      Object.assign(item, { _next_occurrences: nextOccurrences });
    });
    return {
      total: resultsFromES.total,
      items: transformToUnifiedSearchResults(resultsFromES.items),
    };
  } catch (error) {
    log.error(`filterEvents:: ${JSON.stringify(error)}`);
    const resultsFromFS = await getEventFilterResultsFromFS(queryParams);
    return { total: resultsFromFS.total, items: transformToUnifiedSearchResults(resultsFromFS.items) };
  }
}

export async function getHomeCarouselEvents(): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const queryParamsForHomeCarousel: ParsedQs = {};
  Object.assign(queryParamsForHomeCarousel, { offset: 0 });
  Object.assign(queryParamsForHomeCarousel, { limit: 10 });
  Object.assign(queryParamsForHomeCarousel, { type: 'LIVE_STREAM' });
  Object.assign(queryParamsForHomeCarousel, { occurrence_types: 'live,future' });
  Object.assign(queryParamsForHomeCarousel, { sort_option: 'start_date' });
  Object.assign(queryParamsForHomeCarousel, { sort_direction: 'asc' });
  return filterEvents(queryParamsForHomeCarousel);
}
