import { AxiosResponse } from 'axios';
import * as builder from 'elastic-builder';
import _ from 'lodash';
import path from 'path';
import config from '../../config';
import { ESClient, ESDefaultClient } from '../../helper/axios.helper';
import {
  ESMultiIndexSearchResponse,
  ESSearchDOCSourceResponse,
  ESSearchHITResponse,
  ESSearchTransformResponse,
  ESSingleIndexSearchResponse,
} from '../../model/shared/elastic.model';
import { ESIndex, ESIndexName, LogLevel, ResultSource, SearchResultType, SearchResultWeight } from '../../shared/enum';
import HTTP404Error from '../../shared/http/http-404-error';
import logger from '../../shared/logger';

const log = logger(path.relative(process.cwd(), __filename));

export function setSearchResultType(pHit: ESSearchHITResponse): ESSearchHITResponse {
  const hit = pHit;
  if (hit._index.indexOf(ESIndexName.LIBRARY_ITEMS) >= 0) {
    hit._source.search_result_type = SearchResultType.LIBRARY_ITEMS;
  } else if (hit._index.indexOf(ESIndexName.USERS) >= 0) {
    hit._source.search_result_type = SearchResultType.USERS;
  } else if (hit._index.indexOf(ESIndexName.GROUPS) >= 0) {
    hit._source.search_result_type = SearchResultType.GROUPS;
  } else if (hit._index.indexOf(ESIndexName.PLAYLISTS) >= 0) {
    hit._source.search_result_type = SearchResultType.PLAYLISTS;
  } else if (hit._index.indexOf(ESIndexName.EVENTS) >= 0) {
    hit._source.search_result_type = SearchResultType.EVENTS;
  } else if (hit._index.indexOf(ESIndexName.HASHTAGS) >= 0) {
    hit._source.search_result_type = SearchResultType.HASHTAGS;
  }
  return hit;
}

export function getSearchResultType(hit: ESSearchHITResponse): SearchResultType {
  if (hit._index.indexOf(ESIndexName.LIBRARY_ITEMS) >= 0) {
    return SearchResultType.LIBRARY_ITEMS;
  }
  if (hit._index.indexOf(ESIndexName.USERS) >= 0) {
    return SearchResultType.USERS;
  }
  if (hit._index.indexOf(ESIndexName.GROUPS) >= 0) {
    return SearchResultType.GROUPS;
  }
  if (hit._index.indexOf(ESIndexName.PLAYLISTS) >= 0) {
    return SearchResultType.PLAYLISTS;
  }
  if (hit._index.indexOf(ESIndexName.EVENTS) >= 0) {
    return SearchResultType.EVENTS;
  }
  if (hit._index.indexOf(ESIndexName.HASHTAGS) >= 0) {
    return SearchResultType.HASHTAGS;
  }
  if (hit._index.indexOf(ESIndexName.USER_RELATIONS) >= 0) {
    return SearchResultType.USER_RELATION;
  }
  if (hit._index.indexOf(ESIndexName.EMAIL_DOMAIN) >= 0) {
    return SearchResultType.EMAIL_DOMAINS;
  }
  return SearchResultType.UNKNOWN;
}

export function transformFromSingleIndexESResponse(
  response: AxiosResponse,
  searchResultType?: SearchResultType,
): ESSearchTransformResponse {
  let total = 0;
  let items = [];
  if (response.data && response.data.hits) {
    const esResult = response.data.hits;
    if (esResult.hits.length > 0) {
      total += esResult.total;
      items = esResult.hits.map(
        (hit: ESSearchHITResponse): ESSearchDOCSourceResponse => {
          const searchType = searchResultType || getSearchResultType(hit);
          Object.assign(hit._source, { search_result_type: searchType });
          Object.assign(hit._source, { source: ResultSource.ES });
          Object.assign(hit._source, { score: hit._score || 0 });
          return hit._source;
        },
      );
    }
  }
  return { items, total };
}

export async function getSingleIndexResultsFromES(
  esIndex: string,
  esQuery: builder.RequestBodySearch,
  throwError = true,
  esClient?: ESClient,
  searchResultType?: SearchResultType,
): Promise<ESSearchTransformResponse> {
  const client = esClient || ESDefaultClient;
  return client
    .post(`${esIndex}/_search`, `${JSON.stringify(esQuery)}`)
    .then((response): ESSearchTransformResponse => transformFromSingleIndexESResponse(response, searchResultType))
    .catch(
      (error): ESSearchTransformResponse => {
        log.error(`ES Search Error => ${error.stack}.`);
        if (throwError) {
          throw error;
        }
        return {
          total: 0,
          items: [],
        };
      },
    );
}

function sortFilterIndexResult(
  items: ESSearchDOCSourceResponse[],
  total: number,
  limit: number,
): ESSearchTransformResponse {
  const map = new Map<SearchResultType, ESSearchDOCSourceResponse[]>();
  items.forEach((item: ESSearchDOCSourceResponse): void => {
    if (map.get(item.search_result_type)) {
      const existingList: ESSearchDOCSourceResponse[] = map.get(item.search_result_type) || [];
      existingList.push(item);
    } else {
      const list: ESSearchDOCSourceResponse[] = [item];
      map.set(item.search_result_type, list);
    }
  });
  const cloneItems: ESSearchDOCSourceResponse[] = [];
  map.forEach((value: ESSearchDOCSourceResponse[], key: SearchResultType): void => {
    const summaryKeyName: SearchResultType = key;
    const summaryLimit: number = SearchResultWeight[summaryKeyName];
    const mapItems: ESSearchDOCSourceResponse[] = value
      .sort((searchResultItem1, searchResultItem2): number => {
        return searchResultItem1.score < searchResultItem2.score ? 1 : -1;
      })
      .splice(0, summaryLimit) as ESSearchDOCSourceResponse[];
    cloneItems.push(...mapItems);
  });

  return {
    items: cloneItems.splice(0, limit),
    total,
  };
}

export function transformFromMultiIndexESResponse(
  response: AxiosResponse<ESMultiIndexSearchResponse>,
  limit: number,
): ESSearchTransformResponse {
  let total = 0;
  const items: ESSearchDOCSourceResponse[] = [];
  if (response.data && response.data.responses) {
    const responsesFromAllIndices: ESSingleIndexSearchResponse[] = response.data.responses;
    responsesFromAllIndices.forEach((singleIndexSearchResponse): void => {
      total += singleIndexSearchResponse.hits.total;
      singleIndexSearchResponse.hits.hits.forEach((searchHITResponse): void => {
        setSearchResultType(searchHITResponse);
        items.push(
          Object.assign(searchHITResponse._source, {
            score: searchHITResponse._score,
          }),
        );
      });
    });
  }
  return sortFilterIndexResult(items, total, limit);
}

export async function getMultiIndexResultsFromES(
  esClient: ESClient,
  esQuery: string,
  limit: number,
): Promise<ESSearchTransformResponse> {
  return esClient
    .post(`/_msearch`, `${esQuery}`)
    .then(
      (response): ESSearchTransformResponse => {
        return transformFromMultiIndexESResponse(response, limit);
      },
    )
    .catch(
      (error): ESSearchTransformResponse => {
        log.error(`ES Search Error => ${error}.`);
        return {
          total: 0,
          items: [],
        };
      },
    );
}

export async function getDocumentByIDFromES(
  id: string,
  esIndex: ESIndex | string,
  esClient?: ESClient,
  dashFields?: string[],
): Promise<ESSearchDOCSourceResponse> {
  return (esClient || ESDefaultClient)
    .get(`${esIndex}/_doc/${id}`)
    .then(
      (response): ESSearchDOCSourceResponse => {
        const document: ESSearchDOCSourceResponse = dashFields
          ? _.pick(response.data._source, dashFields)
          : response.data._source;
        if (!document.id) {
          document.id = response.data._id;
        }
        if (config.gae.logs.level?.toUpperCase() === LogLevel.DEBUG) {
          document.source = ResultSource.ES;
          document.search_result_type = getSearchResultType(response.data);
          document.score = response.data._score || 0;
        }
        return document;
      },
    )
    .catch(
      (error): ESSearchDOCSourceResponse => {
        throw new HTTP404Error(`Document with id : ${id} is not found in ${esIndex} : ${error}`);
      },
    );
}

export function transformFromMultiDocumentESResponse(
  response: AxiosResponse,
  dashFields: string[],
): ESSearchTransformResponse {
  let total = 0;
  let items: ESSearchDOCSourceResponse[] = [];
  if (response.data && response.data.docs) {
    const esResult: ESSearchHITResponse[] = response.data.docs;
    if (esResult.length > 0) {
      total += esResult.length;
      items = esResult.map(
        (hit: ESSearchHITResponse): ESSearchDOCSourceResponse => {
          const document: ESSearchDOCSourceResponse = dashFields
            ? (_.pick(hit._source, dashFields) as ESSearchDOCSourceResponse)
            : hit._source;
          if (!document.id) {
            document.id = hit._id;
          }
          document.source = ResultSource.ES;
          document.search_result_type = getSearchResultType(hit);
          document.score = hit._score || 0;
          return document;
        },
      );
    }
  }
  return { items, total };
}

export async function getDocumentsByIDListFromES(
  idList: string[],
  esIndex: string,
  dashFields: string[],
  esClient?: ESClient,
): Promise<ESSearchTransformResponse> {
  return (esClient || ESDefaultClient)
    .post(`${esIndex}/_doc/_mget`, { ids: idList })
    .then((response): ESSearchTransformResponse => transformFromMultiDocumentESResponse(response, dashFields))
    .catch(
      (error): ESSearchTransformResponse => {
        log.error(`ES Search Error => ${error.stack}.`);
        return {
          total: 0,
          items: [],
        };
      },
    );
}
