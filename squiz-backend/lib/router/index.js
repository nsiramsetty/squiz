"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const domain_route_1 = __importDefault(require("./domain/domain.route"));
// import path from 'path';
// import logger from '../shared/logger';
const event_route_1 = __importDefault(require("./event/event.route"));
const group_route_1 = __importDefault(require("./group/group.route"));
const hashtag_route_1 = __importDefault(require("./hashtag/hashtag.route"));
const audio_route_1 = __importDefault(require("./library-item/audio.route"));
const course_route_1 = __importDefault(require("./library-item/course.route"));
const daily_insight_route_1 = __importDefault(require("./library-item/daily-insight.route"));
const single_track_route_1 = __importDefault(require("./library-item/single-track.route"));
const playlist_route_1 = __importDefault(require("./playlist/playlist.route"));
const top_view_route_1 = __importDefault(require("./top-view/top-view.route"));
const topic_route_1 = __importDefault(require("./topic/topic.route"));
const publisher_route_1 = __importDefault(require("./user/publisher.route"));
const user_route_1 = __importDefault(require("./user/user.route"));
// const log = logger(path.relative(process.cwd(), __filename));
exports.router = express_1.Router();
const routesList = [
    ...user_route_1.default,
    ...publisher_route_1.default,
    ...group_route_1.default,
    ...audio_route_1.default,
    ...course_route_1.default,
    ...single_track_route_1.default,
    ...event_route_1.default,
    ...playlist_route_1.default,
    ...top_view_route_1.default,
    ...topic_route_1.default,
    ...daily_insight_route_1.default,
    ...hashtag_route_1.default,
    ...domain_route_1.default,
];
routesList.forEach((route) => {
    const { method, requestPath, handler } = route;
    switch (method) {
        case 'get':
        case 'GET':
            exports.router.get(`${requestPath}`, handler);
            break;
        case 'post':
        case 'POST':
            exports.router.post(`${requestPath}`, handler);
            break;
        case 'put':
        case 'PUT':
            exports.router.put(`${requestPath}`, handler);
            break;
        case 'delete':
        case 'DELETE':
            exports.router.delete(`${requestPath}`, handler);
            break;
        case 'head':
        case 'HEAD':
            exports.router.head(`${requestPath}`, handler);
            break;
        default:
    }
});
exports.default = { router: exports.router };
//# sourceMappingURL=index.js.map