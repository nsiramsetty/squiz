import axios from 'axios';
import * as admin from 'firebase-admin';
import { constants } from 'http2';
import _ from 'lodash';
import path from 'path';
import { JsonObject } from 'swagger-ui-express';
import config from '../../config';
import { SearchResultResponse } from '../../model/response/search-result.model';
import {
  FSSearchCondition,
  FSSearchDOCSourceResponse,
  FSSearchTransformResponse,
  FSSortCondition,
} from '../../model/shared/firestore.model';
import { Collection, LogLevel, ResultSource, SearchResultType } from '../../shared/enum';
import HTTP404Error from '../../shared/http/http-404-error';
import HTTPClientError from '../../shared/http/http-client-error';
import logger from '../../shared/logger';

const log = logger(path.relative(process.cwd(), __filename));

// TODO: in future implementation
export const getBearerToken = (userId: string): string => {
  return `XXX - ${userId}`;
};

export const getRequestHeader = (isCacheEnable: boolean): JsonObject => {
  const requestHeader: JsonObject = {
    ContentType: 'application/json',
    'x-request-from': 'SEARCH_AND_FILTERING',
  };
  if (isCacheEnable) {
    Object.assign(requestHeader, { 'x-enable-caching': true });
  }
  return requestHeader;
};

export const getExtractDocPath = (docPath: string): JsonObject => {
  const docPathArr: string[] = docPath.split('/');
  return { documentID: docPathArr.pop(), collectionPath: docPathArr.join('/') };
};

export function getSearchResultType(collection: Collection | string): SearchResultType {
  if (collection === Collection.LIBRARY_ITEMS) {
    return SearchResultType.LIBRARY_ITEMS;
  }
  if (collection === Collection.COURSES) {
    return SearchResultType.LIBRARY_ITEMS;
  }
  if (collection === Collection.USERS) {
    return SearchResultType.USERS;
  }
  if (collection === Collection.GROUPS) {
    return SearchResultType.GROUPS;
  }
  if (collection === Collection.PLAYLISTS) {
    return SearchResultType.PLAYLISTS;
  }
  if (collection === Collection.EVENTS) {
    return SearchResultType.EVENTS;
  }
  if (collection === Collection.HASHTAGS) {
    return SearchResultType.HASHTAGS;
  }
  if (collection === Collection.EMAIL_DOMAIN) {
    return SearchResultType.EMAIL_DOMAINS;
  }
  return SearchResultType.UNKNOWN;
}

export function transformFromFSResponses(
  responseDataObj: JsonObject,
  fsCollection: string,
  searchResultType?: SearchResultType,
): JsonObject {
  const items = responseDataObj.data.map(
    (responseData: JsonObject): JsonObject => {
      const item = responseData as JsonObject;
      item.source = ResultSource.FS;
      item.search_result_type = getSearchResultType(fsCollection);
      if (item.search_result_type === SearchResultType.UNKNOWN && searchResultType) {
        item.search_result_type = searchResultType;
      }
      return item;
    },
  );
  return { items, total: items.length };
}

export const getFirestoreDocById = async (
  collectionPath: string | Collection,
  documentId: string,
  dashFields?: string[],
  isCacheEnable: boolean = true,
): Promise<SearchResultResponse> => {
  const params = {
    collection: collectionPath,
    id: documentId,
  };
  const response = await axios
    .get(`${config.search.getFirestoreServiceBaseURL()}/document`, {
      headers: getRequestHeader(isCacheEnable),
      params,
    })
    .then(
      (responseData): JsonObject => {
        if (!responseData || !responseData.data) {
          throw new HTTP404Error(`Document with id : ${documentId} is not found in ${collectionPath}`);
        }
        const document = (dashFields ? _.pick(responseData.data, dashFields) : responseData.data) as JsonObject;
        if (!document) {
          throw new HTTP404Error(`Document with id : ${documentId} is not found in ${collectionPath}`);
        }
        if (config.gae.logs.level?.toUpperCase() === LogLevel.DEBUG) {
          document.source = ResultSource.FS;
          document.search_result_type = getSearchResultType(collectionPath);
        }
        return { data: document };
      },
    )
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    .catch((error) => {
      if (error.response && error.response.data) {
        const message = error.response.data.message || 'There is some technical issue';
        const statusCode = error.response.data.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
        throw new HTTPClientError(message, statusCode, '');
      }
      log.debug(`Document with path : ${collectionPath}/${documentId} is not found :: error :: ${error.message}`);
      return { data: null };
    });
  return response.data as SearchResultResponse;
};

export const getFirestoreDocuments = async (
  collectionPath: string,
  fsSearchConditions?: FSSearchCondition[],
  fsSortConditions?: FSSortCondition[],
  offset?: number,
  limit?: number,
  fieldMasks?: string[],
  searchResultType?: SearchResultType,
  throwError = true,
  isCacheEnable: boolean = true,
): Promise<FSSearchTransformResponse> => {
  const params = {
    collection: collectionPath,
    ...(offset && { offset }),
    ...(limit && { limit }),
  };

  const requestedPayload = {
    ...(fieldMasks && { fieldMasks }),
    ...(fsSearchConditions && { fsSearchConditions }),
    ...(fsSortConditions && { fsSortConditions }),
  };
  const response = await axios
    .post(`${config.search.getFirestoreServiceBaseURL()}/documents`, requestedPayload, {
      headers: getRequestHeader(isCacheEnable),
      params,
    })
    .then(
      (responseData): JsonObject => {
        return { data: transformFromFSResponses(responseData, collectionPath, searchResultType) };
      },
    )
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    .catch((error) => {
      log.debug(`Document with path : ${collectionPath} is not found :: error :: ${error.message}`);
      if (throwError) {
        throw error;
      }
      return { data: null, error: error.message };
    });
  return response.data as FSSearchTransformResponse;
};

export function transformFromFSResponse(
  snapshot: FirebaseFirestore.QuerySnapshot,
  fsCollection: string,
  searchResultType?: SearchResultType,
): FSSearchTransformResponse {
  const items = snapshot.docs.map(
    (doc): FSSearchDOCSourceResponse => {
      const item: FSSearchDOCSourceResponse = doc.data() as FSSearchDOCSourceResponse;
      item.id = item.id ? item.id : doc.ref.id;
      item.source = ResultSource.FS;
      item.search_result_type = getSearchResultType(fsCollection);
      if (item.search_result_type === SearchResultType.UNKNOWN && searchResultType) {
        item.search_result_type = searchResultType;
      }
      return item;
    },
  );
  return { items, total: items.length };
}

export function mergeMultipleTransformFromFSResponse(
  fsSearchTransformResponsesList: FSSearchTransformResponse[],
  limit: number,
): FSSearchTransformResponse {
  let items: FSSearchDOCSourceResponse[] = [];
  fsSearchTransformResponsesList.forEach((fsSearchTransformResponse: FSSearchTransformResponse): void => {
    items = items.concat(...fsSearchTransformResponse.items);
  });
  items = items.slice(0, limit);
  return { items, total: items.length };
}

export function getResultsFromFSQuery(
  fsCollection: string,
  searchConditions: FSSearchCondition[],
  sortConditions: FSSortCondition[],
  offset: number,
  limit: number,
  fieldMasks: string[],
  searchResultType?: SearchResultType,
  throwError = true,
): Promise<FSSearchTransformResponse> {
  let fsCollectionQuery: FirebaseFirestore.Query = admin.firestore().collection(fsCollection);
  searchConditions.forEach((condition: FSSearchCondition): void => {
    fsCollectionQuery = fsCollectionQuery.where(condition.fieldPath, condition.opStr, condition.value);
  });
  sortConditions.forEach((condition: FSSortCondition): void => {
    fsCollectionQuery = fsCollectionQuery.orderBy(condition.fieldPath, condition.directionStr);
  });
  return fsCollectionQuery
    .select(...fieldMasks)
    .offset(offset)
    .limit(limit)
    .get()
    .then(
      (snapshot): FSSearchTransformResponse => {
        return transformFromFSResponse(snapshot, fsCollection, searchResultType);
      },
    )
    .catch(
      (error): FSSearchTransformResponse => {
        log.error(`Error while retrieving results from Firestore :: ${error}`);
        if (throwError) {
          throw error;
        }
        return { total: 0, items: [] };
      },
    );
}

export function getByIDFromFS(
  documentID: string,
  fsCollection: string | Collection,
  dashFields?: string[],
): Promise<FSSearchDOCSourceResponse> {
  const fsCollectionQuery = admin.firestore().doc(`/${fsCollection}/${documentID}`);
  return fsCollectionQuery.get().then(
    (snapshot): FSSearchDOCSourceResponse => {
      if (!snapshot.exists || !snapshot.data()) {
        throw new HTTP404Error(`Document with id : ${documentID} is not found in ${fsCollection}`);
      }
      const document = (dashFields
        ? _.pick(snapshot.data(), dashFields)
        : snapshot.data()) as FSSearchDOCSourceResponse;
      if (!document) {
        throw new HTTP404Error(`Document with id : ${documentID} is not found in ${fsCollection}`);
      }
      if (!document.id) {
        document.id = snapshot.ref.id;
      }
      if (config.gae.logs.level?.toUpperCase() === LogLevel.DEBUG) {
        document.source = ResultSource.FS;
        document.search_result_type = getSearchResultType(fsCollection);
      }
      return document;
    },
  );
}
