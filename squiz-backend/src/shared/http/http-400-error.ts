import { constants } from 'http2';
import HTTPClientError from './http-client-error';

export default class HTTP400Error extends HTTPClientError {
  public constructor(message: string = 'Bad Request') {
    super(message, constants.HTTP_STATUS_BAD_REQUEST);
  }
}
