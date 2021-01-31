import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { SearchResultResponse, UnifiedSearchResponse } from '../../model/response/search-result.model';
import { filterSingleTracks } from '../../service/library-item/single-track/single-track.filter.service';
import getSingleTrack, {
  getSingleTrackPublisherProfile,
  getSingleTrackReviews,
} from '../../service/library-item/single-track/single-track.get.service';
import { searchSingleTracks } from '../../service/library-item/single-track/single-track.search.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';

export async function singleTrackSearchHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchSingleTracks(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function singleTrackFilterHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await filterSingleTracks(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function singleTrackReviewsHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<SearchResultResponse>> {
  try {
    return await getSingleTrackReviews(cxt.getUrlParam('id'), cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function singleTrackGetByIDHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getSingleTrack(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function singleTrackPublisherProfileHandler(
  cxt: HttpRequestContext,
): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getSingleTrackPublisherProfile(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
