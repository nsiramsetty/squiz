import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { SearchResultResponse, UnifiedSearchResponse } from '../../model/response/search-result.model';
import { filterCourses } from '../../service/library-item/course/course.filter.service';
import {
  getCourse,
  getCourseDays,
  getCoursePublisherProfile,
  getCourseReviews,
} from '../../service/library-item/course/course.get.service';
import { searchCourses } from '../../service/library-item/course/course.search.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';

export async function courseSearchHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchCourses(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function courseFilterHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await filterCourses(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function courseGetByIDHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getCourse(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function coursePublisherProfileHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getCoursePublisherProfile(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function courseReviewsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  try {
    return await getCourseReviews(cxt.getUrlParam('id'), cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function courseDaysHandler(cxt: HttpRequestContext): Promise<ResponseWrapperModel<SearchResultResponse>> {
  try {
    return await getCourseDays(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
