import { GrouptDifferenceResponse } from '../../model/group/group.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { differenceGroups } from '../../service/group/group.difference.service';
import { filterGroups } from '../../service/group/group.filter.service';
import getGroup from '../../service/group/group.get.service';
import { searchGroups } from '../../service/group/group.search.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';

export async function groupSearchHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchGroups(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function groupFilterHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await filterGroups(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function groupGetByIDHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getGroup(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function groupDifferenceHandler(): Promise<GrouptDifferenceResponse> {
  try {
    return await differenceGroups();
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
