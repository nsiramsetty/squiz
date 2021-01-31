import { HashtagResponse } from '../../model/hashtag/hashtag.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { filterHashtags } from '../../service/hashtag/hashtag.filter.service';
import getHashtag from '../../service/hashtag/hashtag.get.service';
import { searchHashtags } from '../../service/hashtag/hashtag.search.service';
import { trendingHashtags } from '../../service/hashtag/hashtag.trending.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';

export async function hashtagSearchHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchHashtags(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function hashtagFilterHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await filterHashtags(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function hashtagsGetByIDHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getHashtag(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function getTrendingHashtags(cxt: HttpRequestContext): Promise<ResponseWrapperModel<HashtagResponse>> {
  try {
    return await trendingHashtags(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
