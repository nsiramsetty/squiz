import { NextFunction, Request, Response } from 'express';
import {
  courseDaysHandler,
  courseFilterHandler,
  courseGetByIDHandler,
  coursePublisherProfileHandler,
  courseReviewsHandler,
  courseSearchHandler,
} from '../../handler/library-item/course.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/courses/search:
     *   get:
     *     tags:
     *      - - Library Items => Courses
     *     description: Search in Courses.
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
    requestPath: `/courses/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await courseSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, courseSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/courses/filter:
     *   get:
     *     tags:
     *      - - Library Items => Courses
     *     description: Filter in Courses.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: filter
     *         description: Specifies value tobe search
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: spirituality
     *       - name: topics
     *         description: Specifies value tobe search
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: visualization,sleep
     *       - name: publisher_ids
     *         description: Specifies value tobe search
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: z9e8f6Z8k5z4B7e6v3e8U3S1z2U4j4r4T5S2K7p5q7U1Z6g3b8n9g5b1b8X5Q1g2C3V0J8x0C4U0s4s4Q6T7L4J0R5M1d3V3w3F9
     *       - name: ids
     *         description: Specifies comma seperated course item ids value tobe search
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: b52d6ec6-3584-45aa-991d-c20914ee35a1,daca604b-516c-4f68-8daf-ed5453ed7b33
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
     *       - name: ignore_langs
     *         description: Should consider language in filter or not
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
     *       - name: sort_option
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: popular
     *          enum: [ "popular", "newest", "highest_rated"]
     *          default: popular
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
    requestPath: `/courses/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await courseFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, courseFilterHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/courses/{id}:
     *   get:
     *     tags:
     *      - - Library Items => Courses
     *     description: Get Course Item By ID
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
    requestPath: `/courses/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await courseGetByIDHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, courseGetByIDHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/courses/{id}/publisher-profile:
     *   get:
     *     tags:
     *      - - Library Items => Courses
     *     description: Get Course Publisher Profile By ID
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
    requestPath: `/courses/:id/publisher-profile`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await coursePublisherProfileHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, coursePublisherProfileHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/courses/{id}/reviews:
     *   get:
     *     tags:
     *      - - Library Items => Courses
     *     description: Get Course Reviews By ID
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
    requestPath: `/courses/:id/reviews`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await courseReviewsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, courseReviewsHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/courses/{id}/course-days:
     *   get:
     *     tags:
     *      - - Library Items => Courses
     *     description: Get Course Days By ID
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
    requestPath: `/courses/:id/course-days`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await courseDaysHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, courseDaysHandler);
    },
  },
];
