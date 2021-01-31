import * as builder from 'elastic-builder';
import _ from 'lodash';
import moment from 'moment';
// import path from 'path';
import { ParsedQs } from 'qs';
import { ESDefaultClient } from '../../../helper/axios.helper';
import { EventOccurrence, EVENT_SUMMARY_FIELDS, OCCURRENCE_SUMMARY_FIELDS } from '../../../model/event/event.model';
import {
  COURSE_SUMMARY_FIELDS,
  DAILY_INSIGHT_ITEM_SUMMARY_FIELDS,
  LIBRARY_ITEM_SUMMARY_FIELDS,
} from '../../../model/library-item/library-item.model';
import { PLAYLIST_SUMMARY_FIELDS } from '../../../model/playlist/playlist.model';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { SearchResultResponse } from '../../../model/response/search-result.model';
import { ESSearchDOCSourceResponse } from '../../../model/shared/elastic.model';
import { FSSearchCondition, FSSortCondition } from '../../../model/shared/firestore.model';
import { PublisherGratitudeComment } from '../../../model/user/user.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { Collection, ESIndex, FSWhereOperator, SearchResultType } from '../../../shared/enum';
// import logger from '../../../shared/logger';
import { numberOrDefault } from '../../../utils/query-parameter-parser';
import { getSingleTrackESQueryForRegularFilter } from '../../library-item/single-track/single-track.filter.service';
import { getDocumentByIDFromES, getSingleIndexResultsFromES } from '../../shared/elastic.service';
import { getFirestoreDocById, getFirestoreDocuments } from '../../shared/firestore.service';

// const log = logger(path.relative(process.cwd(), __filename));

export async function getPublisher(id: string): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getDocumentByIDFromES(id, ESIndex.USER, ESDefaultClient).catch(
    async (): Promise<FirebaseFirestore.DocumentData> => {
      return getFirestoreDocById(Collection.USERS, id);
    },
  );
}

export async function getPublisherCourses(id: string): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(0)
    .size(DEFAULT_PAGE_SIZE)
    .source(COURSE_SUMMARY_FIELDS);
  reqBody.sort(builder.sort('created_at.epoch', 'desc'));
  reqBody.sort(builder.sort('number_of_students', 'desc'));
  queries.push(builder.boolQuery().must(builder.matchQuery('publisher.id', id)));
  queries.push(builder.boolQuery().must(builder.matchQuery('item_type', 'COURSES')));
  const esQuery = reqBody.query(builder.boolQuery().must(queries));
  const resultsFromES = await getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery);
  if (resultsFromES.total === 0) {
    const conditionsForSearch: FSSearchCondition[] = [];
    conditionsForSearch.push({
      fieldPath: 'item_type',
      opStr: FSWhereOperator.EQUAL_TO,
      value: 'COURSES',
    });
    conditionsForSearch.push({
      fieldPath: 'publisher.id',
      opStr: FSWhereOperator.EQUAL_TO,
      value: id,
    });
    const conditionsForSort: FSSortCondition[] = [];
    conditionsForSort.push({
      fieldPath: 'created_at',
      directionStr: 'desc',
    });
    conditionsForSort.push({
      fieldPath: 'number_of_students',
      directionStr: 'desc',
    });
    const fieldMasks: string[] = COURSE_SUMMARY_FIELDS;
    const offset = 0;
    const limit: number = DEFAULT_PAGE_SIZE;
    const resultsFromFS = await getFirestoreDocuments(
      Collection.LIBRARY_ITEMS,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      fieldMasks,
    );
    return { total: resultsFromFS.total, items: resultsFromFS.items };
  }
  return { total: resultsFromES.total, items: resultsFromES.items };
}

export async function getPublisherPlaylists(
  id: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const epoch = moment.utc().subtract(moment.duration(5, 'minutes')).valueOf();
  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(PLAYLIST_SUMMARY_FIELDS);
  reqBody.sort(builder.sort('created_at.epoch', 'desc'));
  queries.push(builder.boolQuery().must(builder.rangeQuery('created_at.epoch').lte(epoch)));
  queries.push(builder.boolQuery().must(builder.matchQuery('is_private', 'false')));
  queries.push(builder.boolQuery().must(builder.matchQuery('owner.id', id)));
  const esQuery = reqBody.query(builder.boolQuery().must(queries));
  const resultsFromES = await getSingleIndexResultsFromES(ESIndex.PLAYLIST, esQuery);
  if (resultsFromES.total === 0) {
    const conditionsForSearch: FSSearchCondition[] = [];
    conditionsForSearch.push({
      fieldPath: 'is_private',
      opStr: FSWhereOperator.EQUAL_TO,
      value: false,
    });
    conditionsForSearch.push({
      fieldPath: 'created_at.epoch',
      opStr: FSWhereOperator.LESS_THAN_EQUAL_TO,
      value: epoch,
    });
    const conditionsForSort: FSSortCondition[] = [];
    conditionsForSort.push({
      fieldPath: 'created_at.epoch',
      directionStr: 'desc',
    });

    const fieldMasks: string[] = PLAYLIST_SUMMARY_FIELDS;
    const resultsFromFS = await getFirestoreDocuments(
      `${Collection.USERS}/${id}/owned_playlists`,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      fieldMasks,
    );
    return { total: resultsFromFS.total, items: resultsFromFS.items };
  }
  return { total: resultsFromES.total, items: resultsFromES.items };
}

export async function getPublisherDailyInsights(id: string): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const tomorrow = moment.utc().add(1, 'days').format('YYYY-MM-DD');
  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(0)
    .size(DEFAULT_PAGE_SIZE)
    .source(DAILY_INSIGHT_ITEM_SUMMARY_FIELDS);
  reqBody.sort(builder.sort('calendar_id', 'desc'));
  queries.push(builder.boolQuery().must(builder.matchQuery('publisher.id', id)));
  queries.push(builder.boolQuery().must(builder.matchQuery('item_type', 'DAILY_INSIGHT')));
  queries.push(builder.boolQuery().must(builder.rangeQuery('calendar_id').lte(tomorrow)));
  const esQuery = reqBody.query(builder.boolQuery().must(queries));
  const resultsFromES = await getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery);
  if (resultsFromES.total === 0) {
    const conditionsForSearch: FSSearchCondition[] = [];
    conditionsForSearch.push({
      fieldPath: 'item_type',
      opStr: FSWhereOperator.EQUAL_TO,
      value: 'DAILY_INSIGHT',
    });
    conditionsForSearch.push({
      fieldPath: 'publisher.id',
      opStr: FSWhereOperator.EQUAL_TO,
      value: id,
    });
    conditionsForSearch.push({
      fieldPath: 'calendar_id',
      opStr: FSWhereOperator.LESS_THAN_EQUAL_TO,
      value: tomorrow,
    });
    const conditionsForSort: FSSortCondition[] = [];
    conditionsForSort.push({
      fieldPath: 'calendar_id',
      directionStr: 'desc',
    });
    const fieldMasks: string[] = DAILY_INSIGHT_ITEM_SUMMARY_FIELDS;
    const offset = 0;
    const limit: number = DEFAULT_PAGE_SIZE;
    const resultsFromFS = await getFirestoreDocuments(
      Collection.LIBRARY_ITEMS,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      fieldMasks,
    );
    return { total: resultsFromFS.total, items: resultsFromFS.items };
  }
  return { total: resultsFromES.total, items: resultsFromES.items };
}

export async function getPublisherLibraryItems(
  id: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  Object.assign(queryParams, { publisher_id: id });
  const esQuery = getSingleTrackESQueryForRegularFilter(queryParams);
  const resultsFromES = await getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery);
  if (resultsFromES.total === 0) {
    const conditionsForSearch: FSSearchCondition[] = [];
    conditionsForSearch.push({
      fieldPath: 'item_type',
      opStr: FSWhereOperator.EQUAL_TO,
      value: 'SINGLE_TRACKS',
    });
    conditionsForSearch.push({
      fieldPath: 'content_type',
      opStr: FSWhereOperator.EQUAL_TO,
      value: 'GUIDED',
    });
    conditionsForSearch.push({
      fieldPath: 'publisher.id',
      opStr: FSWhereOperator.EQUAL_TO,
      value: id,
    });
    const conditionsForSort: FSSortCondition[] = [];
    conditionsForSort.push({
      fieldPath: 'play_count',
      directionStr: 'desc',
    });
    const fieldMasks: string[] = LIBRARY_ITEM_SUMMARY_FIELDS;
    const offset = 0;
    const limit: number = DEFAULT_PAGE_SIZE;
    const resultsFromFS = await getFirestoreDocuments(
      Collection.LIBRARY_ITEMS,
      conditionsForSearch,
      conditionsForSort,
      offset,
      limit,
      fieldMasks,
    );
    return { total: resultsFromFS.total, items: resultsFromFS.items };
  }
  return { total: resultsFromES.total, items: resultsFromES.items };
}

export async function getPublisherGratitudeWall(id: string): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const conditionsForSearch: FSSearchCondition[] = [];
  const conditionsForSort: FSSortCondition[] = [];
  conditionsForSort.push({
    fieldPath: 'created_at.epoch',
    directionStr: 'desc',
  });
  const fieldMasks: string[] = ['author'];
  const offset = 0;
  const limit = 20;
  return getFirestoreDocuments(
    `${Collection.USERS}/${id}/private/gratitude_wall_comments/posts`,
    conditionsForSearch,
    conditionsForSort,
    offset,
    limit,
    fieldMasks,
    SearchResultType.GRATITUDE_WALL_POSTS,
  ).then(
    (fsSearchTransformResponse): ResponseWrapperModel<SearchResultResponse> => {
      const items = fsSearchTransformResponse.items
        .filter((doc): boolean => {
          const document = doc as PublisherGratitudeComment;
          return !!(
            document.author &&
            document.author.avatar &&
            (document.author.avatar.medium || document.author.avatar.small)
          );
        })
        .filter((doc): boolean => {
          const document = doc as PublisherGratitudeComment;
          return document.author?.id !== id;
        })
        .map(
          (doc): PublisherGratitudeComment => {
            return Object.assign(doc, { id: doc.id }) as PublisherGratitudeComment;
          },
        );
      return { total: items.length, items: items.splice(0, 20) as SearchResultResponse[] };
    },
  );
}

export async function getPublisherLiveEvents(id: string): Promise<ResponseWrapperModel<SearchResultResponse>> {
  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder.requestBodySearch().from(0).size(20).source(EVENT_SUMMARY_FIELDS);
  const epoch = moment.utc().add(moment.duration(0, 'minutes')).valueOf();
  reqBody.sort(builder.sort('_next_occurrences.start_date.epoch', 'asc'));
  queries.push(builder.boolQuery().must(builder.rangeQuery('_next_occurrences.start_date.epoch').gte(epoch)));
  queries.push(builder.boolQuery().must(builder.matchQuery('owner.id', id)));
  const esQuery = reqBody.query(builder.boolQuery().must(queries));
  const resultsFromES = await getSingleIndexResultsFromES(ESIndex.EVENT, esQuery);
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
    items: resultsFromES.items,
  };
}
