import { NextFunction, Request, Response } from 'express';
import {
  getTrendingHashtags,
  hashtagFilterHandler,
  hashtagSearchHandler,
  hashtagsGetByIDHandler,
} from '../../handler/hashtag/hashtag.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/hashtags/search:
     *   get:
     *     tags:
     *      - Hashtags
     *     description: Search Hashtags.
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
    requestPath: `/hashtags/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await hashtagSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, hashtagSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/hashtags/filter:
     *   get:
     *     tags:
     *      - Hashtags
     *     description: Filter Hashtags.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value for Search.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: sleep
     *       - name: sort_option
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: created_at
     *          enum: ["created_at", "name"]
     *          default: created_at
     *       - name: sort_direction
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: desc
     *          enum: ["asc","desc"]
     *          default: desc
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
    requestPath: `/hashtags/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await hashtagFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, hashtagFilterHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/hashtags/trending:
     *   get:
     *     tags:
     *      - Hashtags
     *     description: Get Trending Hashtags
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: days
     *         description: Specifies value to Fetch Trending Topic by latest No of Days
     *         in: query
     *         schema:
     *          type : number
     *          required: false
     *          example: 10
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
    requestPath: `/hashtags/trending`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getTrendingHashtags(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getTrendingHashtags);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/hashtags/{id}:
     *   get:
     *     tags:
     *      - Hashtags
     *     description: Get Hashtag By Id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: abundance-en
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/hashtags/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await hashtagsGetByIDHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, hashtagsGetByIDHandler);
    },
  },
];
