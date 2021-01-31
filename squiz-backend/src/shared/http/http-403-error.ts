import { constants } from 'http2';
import HTTPClientError from './http-client-error';

export default class HTTP403Error extends HTTPClientError {
  public constructor(message: string = 'Forbidden') {
    super(message, constants.HTTP_STATUS_FORBIDDEN);
  }
}
