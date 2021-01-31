import { constants } from 'http2';
import HTTPClientError from './http-client-error';

export default class HTTP500Error extends HTTPClientError {
  public constructor(message: string = 'Internal Server Error', stackTrace: string | undefined) {
    super(message, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, stackTrace);
  }
}
