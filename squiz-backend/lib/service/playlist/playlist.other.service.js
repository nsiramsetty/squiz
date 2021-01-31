"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherPlaylists = exports.getOtherPlaylistResults = void 0;
// import logger from '../../shared/logger';
const transform_service_1 = __importDefault(require("../shared/transform.service"));
const publisher_get_service_1 = require("../user/publisher/publisher.get.service");
const playlist_get_service_1 = __importDefault(require("./playlist.get.service"));
// const log = logger(path.relative(process.cwd(), __filename));
async function getOtherPlaylistResults(playlistId, queryParams) {
    const playlist = (await playlist_get_service_1.default(playlistId));
    const { id } = playlist.owner;
    if (id) {
        const resultsFromES = await publisher_get_service_1.getPublisherPlaylists(id, queryParams);
        let { items } = resultsFromES;
        items = items.filter((e) => {
            const element = e;
            return !!(element.number_of_library_items && element.number_of_library_items > 2) && element.id !== playlistId;
        });
        return Promise.resolve({ total: resultsFromES.total, items });
    }
    return Promise.resolve({ total: 0, items: [] });
}
exports.getOtherPlaylistResults = getOtherPlaylistResults;
async function otherPlaylists(playlistId, queryParams) {
    const resultsFromFS = await getOtherPlaylistResults(playlistId, queryParams);
    return { total: resultsFromFS.total, items: transform_service_1.default(resultsFromFS.items) };
}
exports.otherPlaylists = otherPlaylists;
//# sourceMappingURL=playlist.other.service.js.map