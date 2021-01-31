"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = require("http2");
const cache_handler_1 = require("../middleware/cache.handler");
class ResponseBuilder {
    constructor() {
        this.statusCode_OK = http2_1.constants.HTTP_STATUS_OK;
        this.statusCode_500 = http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    }
    searchResultsResponse(resp, data, isCDNCached = true, clientCacheSeconds) {
        if (isCDNCached) {
            cache_handler_1.addCacheControlToResp(resp, clientCacheSeconds);
        }
        return resp
            .status(this.statusCode_OK)
            .header('content-type', 'application/json')
            .header('x-total-count', data.total.toString())
            .send(data.items);
    }
    defaultHTTPSuccessResponse(resp, data, isCDNCached = true, clientCacheSeconds) {
        if (isCDNCached) {
            cache_handler_1.addCacheControlToResp(resp, clientCacheSeconds);
        }
        return resp.status(this.statusCode_OK).header('content-type', 'application/json').send(data);
    }
    defaultHTTPErrorResponse(resp, error) {
        return resp
            .status(error.statusCode || this.statusCode_500)
            .header('content-type', 'application/json')
            .send(error);
    }
}
const responseBuilder = new ResponseBuilder();
exports.default = responseBuilder;
//# sourceMappingURL=response.builder.js.map