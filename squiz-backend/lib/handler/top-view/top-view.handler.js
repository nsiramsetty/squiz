"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topViewHandlerV2 = void 0;
const top_view_service_1 = require("../../service/top-view/top-view.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function topViewHandler(cxt) {
    try {
        return await top_view_service_1.searchTopView(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.default = topViewHandler;
async function topViewHandlerV2(cxt) {
    try {
        return await top_view_service_1.searchTopViewV2(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.topViewHandlerV2 = topViewHandlerV2;
//# sourceMappingURL=top-view.handler.js.map