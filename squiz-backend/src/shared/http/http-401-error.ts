import { constants } from 'http2';
import HTTPClientError from './http-client-error';

export default class HTTP401Error extends HTTPClientError {
  public constructor(message: string = 'Unauthorised') {
    super(message, constants.HTTP_STATUS_UNAUTHORIZED);
  }
}
