import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { SearchResultResponse, UnifiedSearchResponse } from '../../model/response/search-result.model';
import transformToUnifiedSearchResults from '../../service/shared/transform.service';
import { filterPublishers } from '../../service/user/publisher/publisher.filter.service';
import {
  getPublisher,
  getPublisherCourses,
  getPublisherDailyInsights,
  getPublisherGratitudeWall,
  getPublisherLibraryItems,
  getPublisherLiveEvents,
  getPublisherPlaylists,
} from '../../service/user/publisher/publisher.get.service';
import { searchPublishers } from '../../service/user/publisher/publisher.search.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';

export async function publisherSearchHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchPublishers(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function publisherFilterHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await filterPublishers(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getPublisherHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getPublisher(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getPublisherPlaylistsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getPublisherPlaylists(cxt.getUrlParam('id'), cxt.getRequestParams());
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getPublisherCoursesHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getPublisherCourses(cxt.getUrlParam('id'));
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getPublisherDailyInsightsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getPublisherDailyInsights(cxt.getUrlParam('id'));
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getPublisherLibraryItemsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getPublisherLibraryItems(cxt.getUrlParam('id'), cxt.getRequestParams());
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getPublisherGratitudeWallHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  try {
    return await getPublisherGratitudeWall(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getPublisherLiveEventsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const resultsFromES = await getPublisherLiveEvents(cxt.getUrlParam('id'));
    return { total: resultsFromES.total, items: transformToUnifiedSearchResults(resultsFromES.items) };
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
