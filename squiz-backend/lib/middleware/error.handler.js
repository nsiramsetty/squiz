"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../shared/logger"));
const response_builder_1 = __importDefault(require("../helper/response.builder"));
const http_client_error_1 = __importDefault(require("../shared/http/http-client-error"));
const http_500_error_1 = __importDefault(require("../shared/http/http-500-error"));
const enum_1 = require("../shared/enum");
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
exports.default = (error, req, res, next) => {
    log.error(`${error.stack}`);
    if (config_1.default.gae.logs.level !== enum_1.LogLevel.DEBUG) {
        Object.assign(error, { stackTrace: '' });
    }
    const httpClientError = error instanceof http_client_error_1.default
        ? error
        : new http_500_error_1.default(error.message, config_1.default.gae.logs.level === enum_1.LogLevel.DEBUG ? error.stack : '');
    if (res.headersSent) {
        next(error);
    }
    response_builder_1.default.defaultHTTPErrorResponse(res, httpClientError);
};
//# sourceMappingURL=error.handler.js.map