"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = require("http2");
const http_client_error_1 = __importDefault(require("./http-client-error"));
class HTTP500Error extends http_client_error_1.default {
    constructor(message = 'Internal Server Error', stackTrace) {
        super(message, http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, stackTrace);
    }
}
exports.default = HTTP500Error;
//# sourceMappingURL=http-500-error.js.map