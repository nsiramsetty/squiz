"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const audio_search_service_1 = require("../../service/library-item/audio.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function audioSearchHandler(cxt) {
    try {
        return await audio_search_service_1.searchAudio(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.default = audioSearchHandler;
//# sourceMappingURL=audio.handler.js.map