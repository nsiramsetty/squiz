import { NextFunction, Request, Response } from 'express';
import {
  getPublisherCoursesHandler,
  getPublisherDailyInsightsHandler,
  getPublisherGratitudeWallHandler,
  getPublisherHandler,
  getPublisherLibraryItemsHandler,
  getPublisherLiveEventsHandler,
  getPublisherPlaylistsHandler,
  publisherFilterHandler,
  publisherSearchHandler,
} from '../../handler/user/publisher.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/search:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Search Publishers
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies Value for Search.
     *         in: query
     *         schema:
     *          type : string
     *          required: true
     *          example: Sleep
     *       - name: user_id
     *         description: Specifies Current User ID.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *       - name: offset
     *         description: Specifies Offset Value
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: '0'
     *       - name: limit
     *         description: Specifies Limit Value
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 10
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await publisherSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, publisherSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/filter:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Filter Publishers
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies Value for Search.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: Sleep
     *       - name: starts_with
     *         description: Specifies value from which alphabet to start.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: d,D
     *          default: d,D
     *       - name: geo_distance
     *         description: Specifies value from Geo Distance.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *       - name: geo_pin
     *         description: Specifies value from Geo Pin.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *       - name: ids
     *         description: Specifies comma seperated value for playlist ids.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: 0078DyAUbkYQ4kPEqMr6
     *          default: 0078DyAUbkYQ4kPEqMr6
     *       - name: sort_option
     *         description: Specifies options for Sorting.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: popular
     *          default: popular
     *          enum: [popular,alphabetical,newest]
     *       - name: sort_direction
     *         description: Specifies direction for Sorting.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: desc
     *          default: desc
     *          enum: [asc,desc]
     *       - name: offset
     *         description: Specifies Offset Value
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: '0'
     *       - name: limit
     *         description: Specifies Limit Value
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 10
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await publisherFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, publisherFilterHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/{id}:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Get Publisher By ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the Publisher ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getPublisherHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, getPublisherHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/{id}/playlists:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Get Publisher Playlists
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the Publisher ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/:id/playlists`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getPublisherPlaylistsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getPublisherPlaylistsHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/{id}/courses:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Get Publisher Courses
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the Publisher ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/:id/courses`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getPublisherCoursesHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getPublisherCoursesHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/{id}/daily-insights:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Get Publisher Daily Insights
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the Publisher ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/:id/daily-insights`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getPublisherDailyInsightsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getPublisherDailyInsightsHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/{id}/guided-meditations:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Get Publisher Guided Meditations
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the Publisher ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/:id/guided-meditations`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getPublisherLibraryItemsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getPublisherLibraryItemsHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/{id}/gratitude-wall:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Get Publisher Gratitude Wall
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the Publisher ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/:id/gratitude-wall`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getPublisherGratitudeWallHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getPublisherGratitudeWallHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/publishers/{id}/live-events:
     *   get:
     *     tags:
     *      - Publishers
     *     description: Get Publisher Upcoming Live events
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the Publisher ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/publishers/:id/live-events`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getPublisherLiveEventsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getPublisherLiveEventsHandler);
    },
  },
];
