import * as builder from 'elastic-builder';
// import path from 'path';
import { ParsedQs } from 'qs';
import { HASHTAG_SUMMARY_FIELDS, HASHTAG_SUMMARY_TOP_VIEW_FIELDS } from '../../model/hashtag/hashtag.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, FSWhereOperator, SupportedLanguage } from '../../shared/enum';
import HTTP400Error from '../../shared/http/http-400-error';
// import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';
import transformToUnifiedSearchResults from '../shared/transform.service';

// const log = logger(path.relative(process.cwd(), __filename));

export function getESQueryForHashtagsRegularSearch(
  keyword: string,
  offset: number,
  limit: number,
): builder.RequestBodySearch {
  const fields = ['topic', 'name', 'short_description', 'long_description'];
  const mainQuery = builder.boolQuery().must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('best_fields'));
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(mainQuery)
        .functions([
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(0).type('best_fields'))
            .weight(20),
          builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('best_fields'))
            .weight(10),
        ]),
    )
    .source(HASHTAG_SUMMARY_FIELDS)
    .from(offset)
    .size(limit);
}

export function getESQueryForHashtagsTopViewSearch(
  keyword: string,
  offset: number,
  limit: number,
  deviceLang: string,
): builder.RequestBodySearch {
  const searchFields = ['name^4', 'short_description', 'long_description'];
  return builder
    .requestBodySearch()
    .query(
      builder
        .functionScoreQuery()
        .query(builder.boolQuery().must(builder.multiMatchQuery(searchFields, keyword).fuzziness(2)))
        .functions([
          builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === SupportedLanguage.ENGLISH ? 7 : 23),
          builder
            .weightScoreFunction()
            .filter(
              builder
                .boolQuery()
                .should(builder.termQuery('topic.keyword', keyword.toLowerCase()))
                .should(builder.termQuery('name.keyword', keyword)),
            )
            .weight(40),
        ])
        .boostMode('sum')
        .scoreMode('sum'),
    )
    .source(HASHTAG_SUMMARY_TOP_VIEW_FIELDS)
    .from(offset)
    .size(limit);
}

export async function getHashtagSearchResultsFromFS(
  keyword: string,
  offset: number,
  limit: number,
): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'name',
    opStr: FSWhereOperator.EQUAL_TO,
    value: keyword,
  });
  const conditionsForSort: FSSortCondition[] = [];
  const fieldMasks: string[] = HASHTAG_SUMMARY_FIELDS;
  return getFirestoreDocuments(Collection.HASHTAGS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export async function getHashtagSearchResultsFromES(
  keyword: string,
  offset: number,
  limit: number,
): Promise<ESSearchTransformResponse> {
  const esQuery = getESQueryForHashtagsRegularSearch(keyword, offset, limit);
  return getSingleIndexResultsFromES(ESIndex.HASHTAG, esQuery);
}

export async function searchHashtags(queryParams: ParsedQs): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const keyword: string | undefined = queryParams.query?.toString().trim();
  if (!keyword) {
    throw new HTTP400Error(`searchHashtags :: query :: is Required for Topics Search.`);
  }
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const resultsFromES = await getHashtagSearchResultsFromES(keyword, offset, limit);
  if (resultsFromES.total === 0) {
    const resultsFromFS = await getHashtagSearchResultsFromFS(keyword, offset, limit);
    return {
      total: resultsFromFS.total,
      items: transformToUnifiedSearchResults(resultsFromFS.items),
    };
  }
  return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
}
