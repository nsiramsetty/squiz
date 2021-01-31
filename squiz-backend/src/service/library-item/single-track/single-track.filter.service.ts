import * as builder from 'elastic-builder';
import * as _ from 'lodash';
// import path from 'path';
import { ParsedQs } from 'qs';
import { SINGLE_TRACK_SUMMARY_FIELDS } from '../../../model/library-item/library-item.model';
import { ResponseWrapperModel } from '../../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../../model/shared/elastic.model';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { ESIndex, ItemType } from '../../../shared/enum';
// import logger from '../../../shared/logger';
import { booleanOrDefault, numberOrDefault } from '../../../utils/query-parameter-parser';
import filteringOptionsToESQueryArray from '../../shared/categorization.service';
import { getSingleIndexResultsFromES } from '../../shared/elastic.service';
import transformToUnifiedSearchResults from '../../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function combineRequestedLanguages(
  deviceLang: string,
  contentLang: string | string[],
  isSupportingMusic: boolean = true,
): builder.MatchQuery[] {
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
      /* query.field("lang.iso_639_1");
      query.query(l)
      query.boost(boostFactor);
      */
      boostFactor = boostFactor / 2 || 1;
      return query;
    },
  );

  if (requestedLangQueries.length === 0) {
    const query = new builder.MatchQuery('lang.iso_639_1', 'en');
    /* query.field("lang.iso_639_1");
    query.query("en")
    query.boost(boostFactor / 2 || 1);
    */
    requestedLangQueries.push(query);
  }

  if (isSupportingMusic) {
    if (requestedLang.length !== 0) {
      const query = new builder.MatchQuery('lang.iso_639_1', 'm1');
      /* query.field("lang.iso_639_1");
      query.query("m1")
      query.boost(boostFactor / 2 || 1);
      */
      requestedLangQueries.push(query);
    }
  }
  return requestedLangQueries;
}

export function getSingleTrackESQueryForRegularFilter(queryParams: ParsedQs): builder.RequestBodySearch {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const keyword: string | undefined = queryParams.query?.toString().trim();
  let content_types = queryParams.content_types?.toString().trim();
  const content_filters = queryParams.content_filters?.toString().trim();
  const tags = queryParams.tags?.toString().trim();
  const genres = queryParams.genres?.toString().trim();
  const contentLanguage = queryParams.content_langs || 'en';
  const languages: builder.MatchQuery[] = combineRequestedLanguages(
    queryParams.device_lang?.toString().trim(),
    contentLanguage.toString().trim(),
  );
  const ignore_langs = queryParams.ignore_langs?.toString().trim();
  const sort_option = queryParams.sort_option?.toString().trim();
  const length_range = queryParams.length_range?.toString().trim();
  const length_option = queryParams.length_option?.toString().trim();
  const has_background_music = queryParams.has_background_music?.toString().trim();
  const voice_gender = queryParams.voice_gender?.toString().trim();
  const topics = queryParams.topics?.toString().trim();
  const ids = queryParams.ids?.toString().trim();
  const publisher_id = queryParams.publisher_id?.toString().trim();
  const publisher_ids = queryParams.publisher_ids?.toString().trim();
  const count_unique_publishers = booleanOrDefault(queryParams.count_unique_publishers?.toString().trim(), false);

  let queries: builder.Query[] = [];
  let musicQueries: builder.Query[] = [];
  let range = null;

  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(offset)
    .size(limit)
    .source(SINGLE_TRACK_SUMMARY_FIELDS);

  if (count_unique_publishers) {
    reqBody.agg(new builder.CardinalityAggregation('publisher', 'publisher.id'));
  }

  if (keyword) {
    const matchQuery = builder
      .boolQuery()
      .must(builder.multiMatchQuery(['title', 'description'], keyword))
      .filter(
        builder
          .boolQuery()
          .mustNot(builder.termQuery('item_type.keyword', ItemType.DAILY_INSIGHT))
          .mustNot(builder.termQuery('item_type.keyword', ItemType.COURSES)),
      );
    queries.push(matchQuery);
    musicQueries.push(matchQuery);
  } else {
    const filteredQuery = builder
      .boolQuery()
      .must(builder.matchAllQuery())
      .filter(
        builder
          .boolQuery()
          .mustNot(builder.termQuery('item_type.keyword', ItemType.DAILY_INSIGHT))
          .mustNot(builder.termQuery('item_type.keyword', ItemType.COURSES)),
      );
    queries.push(filteredQuery);
    musicQueries.push(filteredQuery);
  }

  if (tags) {
    const hashtagQuery = builder
      .boolQuery()
      .must(tags.split(',').map((val): builder.MatchQuery => builder.matchQuery('hashtags.id', val)));
    queries.push(hashtagQuery);
    musicQueries.push(hashtagQuery);
  }

  if (genres) {
    const genresQuery = builder.boolQuery().should(
      genres
        .toUpperCase()
        .split(',')
        .map((val): builder.MatchQuery => builder.matchQuery('music_type', val)),
    );
    queries.push(genresQuery);
    musicQueries.push(genresQuery);
  }

  if (topics && topics.trim() !== '') {
    const topics_array = topics.replace('teens-meditation', 'children').split(',');
    if (topics_array.indexOf('talks') > -1) {
      content_types = content_types ? `${content_types},talks` : 'talks';
    }
    if (topics_array.indexOf('music') > -1) {
      content_types = content_types ? `${content_types},music` : 'music';
    }
    const filtered = topics_array.filter((val): boolean => {
      return ['talks', 'music'].indexOf(val) < 0;
    });
    if (filtered.length > 0) {
      queries.push(
        builder.boolQuery().must(filtered.map((val): builder.MatchQuery => builder.matchQuery('topics.keyword', val))),
      );
      musicQueries.push(
        builder.boolQuery().must(filtered.map((val): builder.MatchQuery => builder.matchQuery('topics.keyword', val))),
      );
    }
  }

  let mergeQuery = false;
  let isOnlyMusic = false;

  if (content_types) {
    // OR
    const check_content_types = content_types ? content_types.toUpperCase().split(',') : [];

    if (check_content_types.length > 1 && check_content_types.indexOf('MUSIC') > -1) {
      const withoutMusic = check_content_types.filter((val): boolean => {
        return ['MUSIC'].indexOf(val) < 0;
      });
      if (withoutMusic.length > 0) {
        mergeQuery = true;
        // without music apply to main query
        queries.push(
          builder
            .boolQuery()
            .should(withoutMusic.map((val): builder.MatchQuery => builder.matchQuery('content_type', val))),
        );
        // with music on music query
        musicQueries.push(builder.boolQuery().should(builder.matchQuery('content_type', 'MUSIC')));
      } else {
        isOnlyMusic = true;
        queries.push(
          builder.boolQuery().should(
            content_types
              .toUpperCase()
              .split(',')
              .map((val): builder.MatchQuery => builder.matchQuery('content_type', val)),
          ),
        );
      }
    } else if (check_content_types.length === 1 && check_content_types.indexOf('MUSIC') === 0) {
      isOnlyMusic = true;
      queries.push(
        builder.boolQuery().should(
          content_types
            .toUpperCase()
            .split(',')
            .map((val): builder.MatchQuery => builder.matchQuery('content_type', val)),
        ),
      );
    } else {
      queries.push(
        builder.boolQuery().should(
          content_types
            .toUpperCase()
            .split(',')
            .map((val): builder.MatchQuery => builder.matchQuery('content_type', val)),
        ),
      );
    }
  } else if (content_filters && content_filters.trim() !== '') {
    mergeQuery = true;
    queries.push(builder.boolQuery().mustNot(builder.matchQuery('content_type', 'MUSIC')));
    musicQueries.push(builder.boolQuery().must(builder.matchQuery('content_type', 'MUSIC')));
  }

  if (ignore_langs !== 'true' && languages && languages.length > 0) {
    if (isOnlyMusic) {
      queries.push(builder.boolQuery().should([builder.matchQuery('content_type', 'MUSIC')].concat(languages)));
    } else if (mergeQuery && !publisher_id) {
      queries.push(builder.boolQuery().should(languages));
      // support for MUSIC types
      musicQueries.push(builder.boolQuery().should([builder.matchQuery('content_type', 'MUSIC')].concat(languages)));
    } else if (!publisher_id) {
      queries.push(builder.boolQuery().should(languages));
    }
  }

  if (has_background_music) {
    const bmQuery = builder
      .boolQuery()
      .must(builder.matchQuery('has_background_music', has_background_music.toLowerCase()));
    queries.push(bmQuery);
    musicQueries.push(bmQuery);
  }

  queries = queries.concat(filteringOptionsToESQueryArray(queryParams));
  musicQueries = musicQueries.concat(filteringOptionsToESQueryArray(queryParams));

  if (voice_gender) {
    switch (voice_gender.toLowerCase()) {
      case 'male':
        queries.push(builder.boolQuery().must(builder.matchQuery('voice_gender', 'MALE')));
        musicQueries.push(builder.boolQuery().must(builder.matchQuery('voice_gender', 'MALE')));
        break;
      case 'female':
        queries.push(builder.boolQuery().must(builder.matchQuery('voice_gender', 'FEMALE')));
        musicQueries.push(builder.boolQuery().must(builder.matchQuery('voice_gender', 'FEMALE')));
        break;
      default:
        break;
    }
  }

  if (sort_option) {
    switch (sort_option.toLowerCase()) {
      case 'most_played':
        reqBody.sort(builder.sort('play_count', 'desc'));
        break;
      case 'highest_rated':
        reqBody.sort(builder.sort('rating_score', 'desc'));
        break;
      case 'newest':
        reqBody.sort(builder.sort('approved_at.iso_8601_datetime_tz', 'desc'));
        break;
      case 'shortest':
        reqBody.sort(builder.sort('media_length', 'asc'));
        break;
      case 'longest':
        reqBody.sort(builder.sort('media_length', 'desc'));
        break;
      default:
        reqBody.sort(builder.sort('play_count', 'desc'));
    }
  }

  if (length_range) {
    const range_num = length_range.split('to').map((num): number => parseInt(num, 10) * 60);
    if (range_num[0] && range_num[1]) {
      range = builder.rangeQuery('media_length').gte(range_num[0]).lt(range_num[1]);
    } else if (range_num[0]) {
      range = builder.rangeQuery('media_length').gte(range_num[0]);
    } else if (range_num[1]) {
      range = builder.rangeQuery('media_length').lt(range_num[1]);
    }
  } else if (length_option) {
    switch (length_option) {
      case '0_5':
        range = builder.rangeQuery('media_length').gte(0).lt(300);
        break;
      case '5_10':
        range = builder.rangeQuery('media_length').gte(300).lt(600);
        break;
      case '10_15':
        range = builder.rangeQuery('media_length').gte(600).lt(900);
        break;
      case '15_20':
        range = builder.rangeQuery('media_length').gte(900).lt(1200);
        break;
      case '20_30':
        range = builder.rangeQuery('media_length').gte(1200).lt(1800);
        break;
      case '30_':
        range = builder.rangeQuery('media_length').gte(1800);
        break;
      default:
        break;
    }
  }

  if (publisher_id) {
    const publisherIdQuery = builder.boolQuery().must(builder.matchQuery('publisher.id', publisher_id));
    queries.push(publisherIdQuery);
    musicQueries.push(publisherIdQuery);
  }

  if (publisher_ids) {
    const publisherIdsQuery = builder
      .boolQuery()
      .should(publisher_ids.split(',').map((val): builder.MatchQuery => builder.matchQuery('publisher.id', val)));
    queries.push(publisherIdsQuery);
    musicQueries.push(publisherIdsQuery);
  }

  if (ids) {
    const itemIdQuery = builder
      .boolQuery()
      .should(ids.split(',').map((val): builder.MatchQuery => builder.matchQuery('id', val)));
    queries.push(itemIdQuery);
    musicQueries.push(itemIdQuery);
  }

  let finalBool: builder.BoolQuery;
  // Do  some refactoring here
  if (mergeQuery) {
    const finalQueries = [];
    finalQueries.push(builder.boolQuery().must(queries));
    finalQueries.push(builder.boolQuery().must(musicQueries));
    finalBool = builder.boolQuery().should(finalQueries).minimumShouldMatch(1);
  } else {
    finalBool = builder.boolQuery().must(queries);
  }

  if (range) {
    finalBool.filter(range);
  }

  if (!sort_option) {
    const content_langs_array = queryParams.content_langs ? queryParams.content_langs.toString().split(',') : [];
    const content_types_array = content_types ? content_types.toUpperCase().split(',') : [];
    // fix so that other single languages with music will not be swamped with music items.
    if (content_types_array.length === 1 && content_types_array.indexOf('MUSIC') > -1) {
      // only music
      return reqBody.sort(builder.sort('play_count', 'desc')).query(finalBool);
    }
    if (
      content_langs_array.length === 1 &&
      (content_langs_array.indexOf('en') > -1 || content_types_array.length === 1)
    ) {
      return reqBody.sort(builder.sort('play_count', 'desc')).query(finalBool);
    }
    const fsquery = builder
      .functionScoreQuery()
      .functions([
        builder.weightScoreFunction().filter(builder.matchQuery('lang.iso_639_1', 'm1')).weight(0.25),
        builder.fieldValueFactorFunction('rating_score').factor(0.75).modifier('sqrt').missing(1),
        builder.randomScoreFunction().seed(10),
      ])
      .boostMode('replace')
      .query(finalBool);
    if (queryParams.device_lang && queryParams.device_lang !== 'en') {
      fsquery.function(
        builder
          .weightScoreFunction()
          .filter(builder.matchQuery('lang.iso_639_1', queryParams.device_lang.toString().trim()))
          .weight(1.5),
      );
    }
    return reqBody.query(fsquery);
  }
  return reqBody.query(finalBool);
}

export async function getSingleTrackFilterResultsFromES(queryParams: ParsedQs): Promise<ESSearchTransformResponse> {
  const esQuery = getSingleTrackESQueryForRegularFilter(queryParams);
  return getSingleIndexResultsFromES(ESIndex.LIBRARY_ITEM, esQuery, true);
}

export async function filterSingleTracks(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const resultsFromES = await getSingleTrackFilterResultsFromES(queryParams);
  return {
    total: resultsFromES.total,
    items: transformToUnifiedSearchResults(resultsFromES.items),
  };
}
