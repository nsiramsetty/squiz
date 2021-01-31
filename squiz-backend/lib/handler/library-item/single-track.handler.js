"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleTrackPublisherProfileHandler = exports.singleTrackGetByIDHandler = exports.singleTrackReviewsHandler = exports.singleTrackFilterHandler = exports.singleTrackSearchHandler = void 0;
const single_track_filter_service_1 = require("../../service/library-item/single-track/single-track.filter.service");
const single_track_get_service_1 = __importStar(require("../../service/library-item/single-track/single-track.get.service"));
const single_track_search_service_1 = require("../../service/library-item/single-track/single-track.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function singleTrackSearchHandler(cxt) {
    try {
        return await single_track_search_service_1.searchSingleTracks(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.singleTrackSearchHandler = singleTrackSearchHandler;
async function singleTrackFilterHandler(cxt) {
    try {
        return await single_track_filter_service_1.filterSingleTracks(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.singleTrackFilterHandler = singleTrackFilterHandler;
async function singleTrackReviewsHandler(cxt) {
    try {
        return await single_track_get_service_1.getSingleTrackReviews(cxt.getUrlParam('id'), cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.singleTrackReviewsHandler = singleTrackReviewsHandler;
async function singleTrackGetByIDHandler(cxt) {
    try {
        return await single_track_get_service_1.default(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.singleTrackGetByIDHandler = singleTrackGetByIDHandler;
async function singleTrackPublisherProfileHandler(cxt) {
    try {
        return await single_track_get_service_1.getSingleTrackPublisherProfile(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.singleTrackPublisherProfileHandler = singleTrackPublisherProfileHandler;
//# sourceMappingURL=single-track.handler.js.map