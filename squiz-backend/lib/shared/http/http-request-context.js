"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import logger from '../logger';
const http_400_error_1 = __importDefault(require("./http-400-error"));
const http_404_error_1 = __importDefault(require("./http-404-error"));
// const log = logger(path.relative(process.cwd(), __filename));
class HttpRequestContext {
    constructor(request, response, next) {
        this.request = request;
        this.response = response;
        this.next = next;
    }
    getRequestParam(key) {
        if (this.request.query) {
            if (this.request.query[key]) {
                return this.request.query[key];
            }
            throw new http_404_error_1.default(`Request Parameter ${key} not found.`);
        }
        throw new http_400_error_1.default('Empty Request Parameters');
    }
    getRequestParams() {
        if (this.request.query && Object.keys(this.request.query).length > 0) {
            return this.request.query;
        }
        return {};
    }
    getUrlParam(key) {
        if (this.request.params) {
            if (this.request.params[key]) {
                return this.request.params[key];
            }
            throw new http_404_error_1.default(`URL Parameter ${key} not found.`);
        }
        throw new http_400_error_1.default('Empty URL Parameters');
    }
    getRequestBody() {
        if (this.request.body) {
            return this.request.body;
        }
        throw new http_400_error_1.default('Empty Request Body.');
    }
}
exports.default = HttpRequestContext;
//# sourceMappingURL=http-request-context.js.map