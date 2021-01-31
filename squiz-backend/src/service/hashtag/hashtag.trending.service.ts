import * as builder from 'elastic-builder';
import _ from 'lodash';
import path from 'path';
import { ParsedQs } from 'qs';
import { ESClient, ESDefaultClient } from '../../helper/axios.helper';
import { HashtagModel, HashtagResponse, TRENDING_HASHTAG_SUMMARY_FIELDS } from '../../model/hashtag/hashtag.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { ESIndex } from '../../shared/enum';
import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';

const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForTrendingHashtagsFilter(queryParams: ParsedQs): builder.RequestBodySearch {
  const days: number | undefined = numberOrDefault(queryParams.days, 0);
  const reqBody: builder.RequestBodySearch = builder
    .requestBodySearch()
    .from(0)
    .size(0)
    .source(TRENDING_HASHTAG_SUMMARY_FIELDS);

  if (days > 0) {
    reqBody.agg(
      builder
        .filterAggregation(
          'date_range',
          builder.rangeQuery('created_at.iso_8601_datetime_tz').format('dd-MM-yyyy').gte(`now-${days}d/d`),
        )
        .agg(builder.termsAggregation('hashtags', 'hashtags.keyword')),
    );
  } else {
    reqBody.agg(builder.termsAggregation('hashtags', 'hashtags.keyword'));
  }
  return reqBody;
}

export async function getTrendingHashtagFilterResultsFromES(
  queryParams: ParsedQs,
  fieldMasks: string[],
  esIndex: string,
  esClient: ESClient,
): Promise<ResponseWrapperModel<HashtagResponse>> {
  const esQuery = getESQueryForTrendingHashtagsFilter(queryParams);
  return esClient
    .post(`${esIndex}/_search`, `${JSON.stringify(esQuery)}`)
    .then(
      (response): ResponseWrapperModel<HashtagResponse> => {
        const { data } = response;
        const hashtags =
          _.get(data, 'aggregations.date_range.hashtags.buckets') || _.get(data, 'aggregations.hashtags.buckets');
        const results = (hashtags as HashtagModel[]).map(
          (o): HashtagResponse => {
            return {
              hashtag: o.key,
            };
          },
        );
        return {
          total: results.length,
          items: results,
        };
      },
    )
    .catch(
      (error): ResponseWrapperModel<HashtagResponse> => {
        log.error(`ES Search Error => ${error.stack}.`);
        return {
          total: 0,
          items: [],
        };
      },
    );
}

export async function trendingHashtags(queryParams: ParsedQs): Promise<ResponseWrapperModel<HashtagResponse>> {
  const resultsFromES = await getTrendingHashtagFilterResultsFromES(
    queryParams,
    TRENDING_HASHTAG_SUMMARY_FIELDS,
    ESIndex.PLAYLIST,
    ESDefaultClient,
  );
  return { items: resultsFromES.items, total: resultsFromES.total };
}
