import { Response } from 'express';
import { constants } from 'http2';
import { addCacheControlToResp } from '../middleware/cache.handler';
import { ResponseWrapperModel } from '../model/response/response-wrapper.model';
import HTTPSuccessResponse from '../shared/http/http-200-success';
import HTTPClientError from '../shared/http/http-client-error';

class ResponseBuilder {
  public readonly statusCode_OK: number = constants.HTTP_STATUS_OK;

  public readonly statusCode_500: number = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

  public searchResultsResponse(
    resp: Response,
    data: ResponseWrapperModel<HTTPSuccessResponse>,
    isCDNCached: boolean = true,
    clientCacheSeconds?: number,
  ): Response {
    if (isCDNCached) {
      addCacheControlToResp(resp, clientCacheSeconds);
    }
    return resp
      .status(this.statusCode_OK)
      .header('content-type', 'application/json')
      .header('x-total-count', data.total.toString())
      .send(data.items);
  }

  public defaultHTTPSuccessResponse(
    resp: Response,
    data: HTTPSuccessResponse,
    isCDNCached: boolean = true,
    clientCacheSeconds?: number,
  ): Response {
    if (isCDNCached) {
      addCacheControlToResp(resp, clientCacheSeconds);
    }
    return resp.status(this.statusCode_OK).header('content-type', 'application/json').send(data);
  }

  public defaultHTTPErrorResponse(resp: Response, error: HTTPClientError): Response {
    return resp
      .status(error.statusCode || this.statusCode_500)
      .header('content-type', 'application/json')
      .send(error);
  }
}

const responseBuilder = new ResponseBuilder();

export default responseBuilder;
