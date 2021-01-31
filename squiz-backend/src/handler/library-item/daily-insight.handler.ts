import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { SearchResultResponse, UnifiedSearchResponse } from '../../model/response/search-result.model';
import { filterDailyInsight } from '../../service/library-item/daily-insight/daily-insight.filter.service';
import getDailyInsightById, {
  getDailyInsightPublisherProfile,
  getDailyInsightReviews,
} from '../../service/library-item/daily-insight/daily-insight.get.service';
import { searchDailyInsights } from '../../service/library-item/daily-insight/daily-insight.search.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';

export async function dailyInsightSearchHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchDailyInsights(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function dailyInsightFilterHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await filterDailyInsight(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function dailyInsightGetByIDHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getDailyInsightById(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function dailyInsightPublisherProfileHandler(
  cxt: HttpRequestContext,
): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getDailyInsightPublisherProfile(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function dailyInsightReviewsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  try {
    return await getDailyInsightReviews(cxt.getUrlParam('id'), cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
