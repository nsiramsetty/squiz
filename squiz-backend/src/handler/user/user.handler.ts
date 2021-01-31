// import path from 'path';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import transformToUnifiedSearchResults from '../../service/shared/transform.service';
import {
  getUser,
  getUserCourses,
  getUserFollowers,
  getUserFollowings,
  getUserFriends,
  getUserGroups,
} from '../../service/user/user/user.get.service';
import searchUsers from '../../service/user/user/user.search.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';
// import logger from '../../shared/logger';

// const log = logger(path.relative(process.cwd(), __filename));

export async function userSearchHandler(cxt: HttpRequestContext): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchUsers(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function userGetByIDHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getUser(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getUserCoursesHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getUserCourses(cxt.getUrlParam('id'));
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getUserGroupsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getUserGroups(cxt.getUrlParam('id'), cxt.getRequestParams());
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getUserFollowingsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getUserFollowings(cxt.getUrlParam('id'), cxt.getRequestParams());
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getUserFollowersHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getUserFollowers(cxt.getUrlParam('id'), cxt.getRequestParams());
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getUserFriendsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getUserFriends(cxt.getUrlParam('id'), cxt.getRequestParams());
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
