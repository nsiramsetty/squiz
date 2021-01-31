import { NextFunction, Request, Response } from 'express';
import {
  domainFilterHandler,
  domainGetByIDHandler,
  domainMemberHandler,
  domainSearchHandler,
} from '../../handler/domain/domain.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/domains/search:
     *   get:
     *     tags:
     *      - Domains
     *     description: Search Domains
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value to search.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: insight.co
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
    requestPath: `/domains/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await domainSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, domainSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/domains/filter:
     *   get:
     *     tags:
     *      - Domains
     *     description: Filter Domains
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value to search.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: insight.co
     *       - name: sort_option
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: popular
     *          enum: [ "most_members"]
     *          default: most_members
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
    requestPath: `/domains/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await domainFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, domainFilterHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/domains/{id}:
     *   get:
     *     tags:
     *      - Domains
     *     description: Get Domain by ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: insight.co
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/domains/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await domainGetByIDHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, domainGetByIDHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/domains/{id}/members:
     *   get:
     *     tags:
     *      - Domains
     *     description: Get Members of Domain by ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: insight.co
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/domains/:id/members`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await domainMemberHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, domainMemberHandler);
    },
  },
];
