import { NextFunction, Request, Response } from 'express';
import {
  dailyInsightFilterHandler,
  dailyInsightGetByIDHandler,
  dailyInsightPublisherProfileHandler,
  dailyInsightReviewsHandler,
  dailyInsightSearchHandler,
} from '../../handler/library-item/daily-insight.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/daily-insights/search:
     *   get:
     *     tags:
     *      - Library Items => Daily Insights
     *     description: Search in Daily Insights.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value tobe search
     *         in: query
     *         schema:
     *          type : string
     *          required: true
     *          example: sleep
     *       - name: device_lang
     *         description: Specifies the language of device
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: en
     *       - name: is_science
     *         description: Filter Science
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
     *       - name: is_religion
     *         description: Filter Religion
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
     *       - name: is_secular
     *         description: Filter Secular
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
     *       - name: is_newage
     *         description: Filter NewAge
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
     *       - name: is_spiritual
     *         description: Filter Spirituality
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
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
    requestPath: `/daily-insights/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await dailyInsightSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, dailyInsightSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/daily-insights/filter:
     *   get:
     *     tags:
     *      - Library Items => Daily Insights
     *     description: Filter Daily Insight Items
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: type
     *         description: Specifies item type value for Search.
     *         in: query
     *         schema:
     *          type : string
     *          required: true
     *          example: current
     *          enum: [current, future]
     *          default: current
     *       - name: publisher_id
     *         description: Specifies publisher id value for Search.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: m7K4F2Q5S7X3a1j6U8a6X8B0a1e7R1g8E3z4b5k1C8L0Q8B3J6J0k8X5x2J1V6n2u9j3P1u6W0c3L2v3c8f3W7z6H7t4E1t6t0B0
     *          default: m7K4F2Q5S7X3a1j6U8a6X8B0a1e7R1g8E3z4b5k1C8L0Q8B3J6J0k8X5x2J1V6n2u9j3P1u6W0c3L2v3c8f3W7z6H7t4E1t6t0B0
     *       - name: content_lang
     *         description: Specifies the language of content
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: en
     *       - name: device_lang
     *         description: Specifies the language of device
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: en
     *       - name: sort_option
     *         description: Specifies the value for sorting.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: latest
     *          enum: [latest]
     *          default: latest
     *       - name: sort_direction
     *         description: Specifies value for ordering.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: desc
     *          enum: [asc,desc]
     *          default: desc
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
    requestPath: `/daily-insights/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await dailyInsightFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, dailyInsightFilterHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/daily-insights/{id}:
     *   get:
     *     tags:
     *      - Library Items => Daily Insights
     *     description: Get Daily Insight Item By ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: 6CUXUW2t9J3zYgVMllxC
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/daily-insights/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await dailyInsightGetByIDHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, dailyInsightGetByIDHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/daily-insights/{id}/publisher-profile:
     *   get:
     *     tags:
     *      - Library Items => Daily Insights
     *     description: Get Daily Insight Publisher Profile By ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: 6CUXUW2t9J3zYgVMllxC
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/daily-insights/:id/publisher-profile`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await dailyInsightPublisherProfileHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, dailyInsightPublisherProfileHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/daily-insights/{id}/reviews:
     *   get:
     *     tags:
     *      - Library Items => Daily Insights
     *     description: Get Daily Insight Reviews By ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: 6CUXUW2t9J3zYgVMllxC
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/daily-insights/:id/reviews`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await dailyInsightReviewsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, dailyInsightReviewsHandler);
    },
  },
];
