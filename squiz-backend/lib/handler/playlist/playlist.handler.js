"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherPlaylistByIDHandler = exports.relatedPlaylistByIDHandler = exports.playlistGetByIDHandler = exports.playlistFilterHandler = exports.playlistSearchHandler = void 0;
const playlist_filter_service_1 = require("../../service/playlist/playlist.filter.service");
const playlist_get_service_1 = __importDefault(require("../../service/playlist/playlist.get.service"));
const playlist_other_service_1 = require("../../service/playlist/playlist.other.service");
const playlist_related_service_1 = require("../../service/playlist/playlist.related.service");
const playlist_search_service_1 = require("../../service/playlist/playlist.search.service");
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function playlistSearchHandler(cxt) {
    try {
        return await playlist_search_service_1.searchPlaylists(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.playlistSearchHandler = playlistSearchHandler;
async function playlistFilterHandler(cxt) {
    try {
        return await playlist_filter_service_1.filterPlaylists(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.playlistFilterHandler = playlistFilterHandler;
async function playlistGetByIDHandler(cxt) {
    try {
        return await playlist_get_service_1.default(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.playlistGetByIDHandler = playlistGetByIDHandler;
async function relatedPlaylistByIDHandler(cxt) {
    try {
        const playlistId = cxt.getUrlParam('id');
        return await playlist_related_service_1.relatedPlaylists(playlistId, cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.relatedPlaylistByIDHandler = relatedPlaylistByIDHandler;
async function otherPlaylistByIDHandler(cxt) {
    try {
        const playlistId = cxt.getUrlParam('id');
        return await playlist_other_service_1.otherPlaylists(playlistId, cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.otherPlaylistByIDHandler = otherPlaylistByIDHandler;
//# sourceMappingURL=playlist.handler.js.map