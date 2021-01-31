import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import filterDomains from '../../service/domain/domain.filter.service';
import getDomain from '../../service/domain/domain.get.service';
import domainMembers from '../../service/domain/domain.member.service';
import searchDomains from '../../service/domain/domain.search.service';
import HTTPClientError from '../../shared/http/http-client-error';
import HttpRequestContext from '../../shared/http/http-request-context';

export async function domainSearchHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await searchDomains(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function domainFilterHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    return await filterDomains(cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function domainGetByIDHandler(cxt: HttpRequestContext): Promise<FirebaseFirestore.DocumentData> {
  try {
    return await getDomain(cxt.getUrlParam('id'));
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}

export async function domainMemberHandler(
  cxt: HttpRequestContext,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  try {
    const domainId = cxt.getUrlParam('id');
    return await domainMembers(domainId, cxt.getRequestParams());
  } catch (error) {
    const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
    throw new HTTPClientError(`${message}`, error.statusCode, error.stack);
  }
}
