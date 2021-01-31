export default class HTTPClientError extends Error {
  public statusCode!: number;

  public message: string;

  public stackTrace: string;

  public constructor(message: string, statusCode: number, stackTrace: string = '') {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.stackTrace = stackTrace;
  }
}
