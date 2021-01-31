import { NextFunction, Request, Response } from 'express';
import {
  groupDifferenceHandler,
  groupFilterHandler,
  groupGetByIDHandler,
  groupSearchHandler,
} from '../../handler/group/group.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/groups/search:
     *   get:
     *     tags:
     *      - Groups
     *     description: Search groups bases on Query string, Device Language Current User ID.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value for search
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
     *       - name: include_email_domains
     *         description: Specifies comma seperated domains value tobe search
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: insight.co,slack.com
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
    requestPath: `/groups/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await groupSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, groupSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/groups/filter:
     *   get:
     *     tags:
     *      - Groups
     *     description: Filter Groups.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value for Search.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: Authentic
     *       - name: include_hidden
     *         description: Specifies whether to include hidden groups or not.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: false
     *          enum: [ "true", "false"]
     *          default: "false"
     *       - name: include_deleted
     *         description: Specifies whether to include deleted groups or not.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: false
     *          enum: [ "true", "false"]
     *          default: "false"
     *       - name: email_domains
     *         description: Specifies comma seperated domains value tobe search
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: insight.co,slack.com
     *       - name: sort_option
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: popular
     *          enum: [ "newest", "most_members"]
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
    requestPath: `/groups/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await groupFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, groupFilterHandler);
    },
  },
  {
    requestPath: `/groups/difference`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await groupDifferenceHandler();
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, groupDifferenceHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/groups/{id}:
     *   get:
     *     tags:
     *      - Groups
     *     description: Get Group By Id
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
    requestPath: `/groups/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await groupGetByIDHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, groupGetByIDHandler);
    },
  },
];
