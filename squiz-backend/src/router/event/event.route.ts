import { NextFunction, Request, Response } from 'express';
import {
  eventFilterHandler,
  eventGetByIDHandler,
  eventSearchHandler,
  homeCarouselEventsHandler,
} from '../../handler/event/event.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';
import { interceptEventQueryParams } from '../../utils/query-parameter-parser';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/events/search:
     *   get:
     *     tags:
     *      - Events
     *     description: Search Events.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value for Search.
     *         in: query
     *         schema:
     *          type : string
     *          required: true
     *          example: Sleep
     *       - name: offset
     *         description: Specifies offset value
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: '0'
     *       - name: limit
     *         description: Specifies limit value
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
    requestPath: `/events/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await eventSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, eventSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/events/filter:
     *   get:
     *     tags:
     *      - Events
     *     description: Filter Events.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: type
     *         description: Specifies The Event Type.
     *         in: query
     *         schema:
     *          type : string
     *          required: true
     *          example: LIVE_STREAM
     *       - name: query
     *         description: Specifies The Keyword.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: Test
     *       - name: device_lang
     *         description: Specifies The Device Language
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: en
     *       - name: content_langs
     *         description: Specifies The Content Languages
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: es,sv
     *       - name: hashtags
     *         description: Specifies The Hashtags/Topics
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: anxiety,neuroscience
     *       - name: occurrence_types
     *         description: Specifies The Occurrence Types
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: PAST,LIVE,FUTURE,LIVE_STORIES,UPCOMING_SOON
     *       - name: content_types
     *         description: Specifies The Content Types
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: "GUIDED,MUSIC,YOGA,TALK"
     *       - name: include_all_privacy
     *         description: Specifies Whether to show all events irrespective of privacy
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: false
     *          enum: [ "true", "false"]
     *          default: "false"
     *       - name: include_all_status
     *         description: Specifies Whether to show all events irrespective of status
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: false
     *          enum: [ "true", "false"]
     *          default: "false"
     *       - name: start_date_from
     *         description: Specifies Event to be start after date
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 1596697440000
     *          default: 1596697440000
     *       - name: start_date_to
     *         description: Specifies Event to be start up to date
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 1597029296870
     *          default: 1597029296870
     *       - name: end_date_from
     *         description: Specifies Event to be end after date
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 1597029296870
     *          default: 1597029296870
     *       - name: end_date_to
     *         description: Specifies Event to be end up to date
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 1597171980000
     *          default: 1597171980000
     *       - name: content_filters
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: science
     *          enum: [ "science", "newage", "secular", "religion", "spirituality"]
     *          default: science
     *       - name: owner_ids
     *         description: Specifies comma seperated Owner Ids
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: P4E8v1s5X1w9a4a3s9k8B1Z0V4C2y9Z6N3d4N6v7M5Z3p4g2c0d0s8E6L8N7W3s7Q6b6u1p0w0E7b6f4R8E9L3Q7w4g1e8s5w9W1,f0w6N1B9Z1z7N8M5v7c5f4z5y1n6v9R0g7w6N9m9f1r7w0r6S8y8Q0k4Q1G8y6t4y6E5V2A2v6Y1n6U5M0K3E6K3V2A6r0y5u8H4
     *       - name: sort_option
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: start_date
     *          enum: [ "start_date", "end_date" ]
     *          default: start_date
     *       - name: sort_direction
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: asc
     *          enum: ["asc","desc"]
     *          default: asc
     *       - name: offset
     *         description: Specifies offset value
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: '0'
     *          default: 0
     *       - name: limit
     *         description: Specifies limit value
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 10
     *          default: 10
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/events/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await eventFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }

      let isTimeBased = false;
      if (req.query.start_date_from) {
        interceptEventQueryParams(req, 'start_date_from');
        isTimeBased = true;
      }
      if (req.query.start_date_to) {
        interceptEventQueryParams(req, 'start_date_to');
        isTimeBased = true;
      }
      if (req.query.end_date_from) {
        interceptEventQueryParams(req, 'end_date_from');
        isTimeBased = true;
      }
      if (req.query.end_date_to) {
        interceptEventQueryParams(req, 'end_date_to');
        isTimeBased = true;
      }
      if (isTimeBased) {
        redisListResponse(req, res, next, eventFilterHandler, { cacheDuration: 600, recacheInterval: 300 });
      } else {
        redisListResponse(req, res, next, eventFilterHandler);
      }
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/events/{id}:
     *   get:
     *     tags:
     *      - Events
     *     description: Filter in Events
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: 66DC6578-7C24-4E50-9592-950646776D71
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/events/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await eventGetByIDHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, eventGetByIDHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/events/filter/home-carousel:
     *   get:
     *     tags:
     *      - Events
     *     description: Events to Display in Home Carousel
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/events/filter/home-carousel`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await homeCarouselEventsHandler();
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, homeCarouselEventsHandler);
    },
  },
];
