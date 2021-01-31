"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = require("http2");
const http_client_error_1 = __importDefault(require("./http-client-error"));
class HTTP404Error extends http_client_error_1.default {
    constructor(message = 'Not Found') {
        super(message, http2_1.constants.HTTP_STATUS_NOT_FOUND);
    }
}
exports.default = HTTP404Error;
//# sourceMappingURL=http-404-error.js.map