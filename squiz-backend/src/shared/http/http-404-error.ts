import { constants } from 'http2';
import HTTPClientError from './http-client-error';

export default class HTTP404Error extends HTTPClientError {
  public constructor(message: string = 'Not Found') {
    super(message, constants.HTTP_STATUS_NOT_FOUND);
  }
}
