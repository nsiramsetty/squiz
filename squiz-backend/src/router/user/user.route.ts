import { NextFunction, Request, Response } from 'express';
import {
  getUserCoursesHandler,
  getUserFollowersHandler,
  getUserFollowingsHandler,
  getUserFriendsHandler,
  getUserGroupsHandler,
  userGetByIDHandler,
  userSearchHandler,
} from '../../handler/user/user.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/users/search:
     *   get:
     *     tags:
     *      - Users
     *     description: Search Users
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: Specifies value to search.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: sleep
     *       - name: exclude_publishers
     *         description: Specifies search excluding publishers or not.
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: false
     *       - name: user_id
     *         description: Specifies current user id value.
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: f0w6N1B9Z1z7N8M5v7c5f4z5y1n6v9R0g7w6N9m9f1r7w0r6S8y8Q0k4Q1G8y6t4y6E5V2A2v6Y1n6U5M0K3E6K3V2A6r0y5u8H4
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
    requestPath: `/users/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await userSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, userSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/users/{id}:
     *   get:
     *     tags:
     *      - Users
     *     description: Get User by ID
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
    requestPath: `/users/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await userGetByIDHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, userGetByIDHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/users/{id}/courses:
     *   get:
     *     tags:
     *      - Users
     *     description: Get User Courses
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the User ID
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
    requestPath: `/users/:id/courses`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getUserCoursesHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getUserCoursesHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/users/{id}/groups:
     *   get:
     *     tags:
     *      - Users
     *     description: Get User groups
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the User ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
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
    requestPath: `/users/:id/groups`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getUserGroupsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getUserGroupsHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/users/{id}/friends:
     *   get:
     *     tags:
     *      - Users
     *     description: Get User Friends
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the User ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
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
    requestPath: `/users/:id/friends`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getUserFriendsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getUserFriendsHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/users/{id}/followers:
     *   get:
     *     tags:
     *      - Users
     *     description: Get User Followers
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the User ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
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
    requestPath: `/users/:id/followers`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getUserFollowersHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getUserFollowersHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/users/{id}/followings:
     *   get:
     *     tags:
     *      - Users
     *     description: Get User Followings
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies the User ID
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: C3x9q6G0f2z4Z7J3M7F8k3u0Q2e7t3y4L7H3G4N9v9G0r4v3w1S0R4a5p7r4k1u3E2P8H5j7H3T6V9F9Q1F8E4L3p0h4e3X4T9r0
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
    requestPath: `/users/:id/followings`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await getUserFollowingsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, getUserFollowingsHandler);
    },
  },
];
