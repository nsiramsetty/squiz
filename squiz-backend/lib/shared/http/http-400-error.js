"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = require("http2");
const http_client_error_1 = __importDefault(require("./http-client-error"));
class HTTP400Error extends http_client_error_1.default {
    constructor(message = 'Bad Request') {
        super(message, http2_1.constants.HTTP_STATUS_BAD_REQUEST);
    }
}
exports.default = HTTP400Error;
//# sourceMappingURL=http-400-error.js.map