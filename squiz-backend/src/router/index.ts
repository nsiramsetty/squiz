import { Router } from 'express';
import { JsonObject } from 'swagger-ui-express';
import domainRoutes from './domain/domain.route';
// import path from 'path';
// import logger from '../shared/logger';
import eventRoutes from './event/event.route';
import groupRoutes from './group/group.route';
import hashtagRoutes from './hashtag/hashtag.route';
import audioRoutes from './library-item/audio.route';
import courseRoutes from './library-item/course.route';
import dailyInsightRoutes from './library-item/daily-insight.route';
import singleTrackRoutes from './library-item/single-track.route';
import playlistRoutes from './playlist/playlist.route';
import topViewRoutes from './top-view/top-view.route';
import topicRoutes from './topic/topic.route';
import publisherRoues from './user/publisher.route';
import peopleRoutes from './user/user.route';

// const log = logger(path.relative(process.cwd(), __filename));

export const router = Router();

const routesList = [
  ...peopleRoutes,
  ...publisherRoues,
  ...groupRoutes,
  ...audioRoutes,
  ...courseRoutes,
  ...singleTrackRoutes,
  ...eventRoutes,
  ...playlistRoutes,
  ...topViewRoutes,
  ...topicRoutes,
  ...dailyInsightRoutes,
  ...hashtagRoutes,
  ...domainRoutes,
];

routesList.forEach((route: JsonObject): void => {
  const { method, requestPath, handler } = route;
  switch (method) {
    case 'get':
    case 'GET':
      router.get(`${requestPath}`, handler);
      break;
    case 'post':
    case 'POST':
      router.post(`${requestPath}`, handler);
      break;
    case 'put':
    case 'PUT':
      router.put(`${requestPath}`, handler);
      break;
    case 'delete':
    case 'DELETE':
      router.delete(`${requestPath}`, handler);
      break;
    case 'head':
    case 'HEAD':
      router.head(`${requestPath}`, handler);
      break;
    default:
  }
});

export default { router };
