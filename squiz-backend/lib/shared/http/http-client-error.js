"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPClientError extends Error {
    constructor(message, statusCode, stackTrace = '') {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.stackTrace = stackTrace;
    }
}
exports.default = HTTPClientError;
//# sourceMappingURL=http-client-error.js.map