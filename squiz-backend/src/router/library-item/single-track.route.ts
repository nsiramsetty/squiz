import { NextFunction, Request, Response } from 'express';
import {
  singleTrackFilterHandler,
  singleTrackGetByIDHandler,
  singleTrackPublisherProfileHandler,
  singleTrackReviewsHandler,
  singleTrackSearchHandler,
} from '../../handler/library-item/single-track.handler';
import { redisListResponse, redisObjectResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/single-tracks/search:
     *   get:
     *     tags:
     *      - Library Items => Single Tracks
     *     description: Search Single Tracks
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
     *       - name: device_lang
     *         description: Specifies the language of device
     *         in: query
     *         schema:
     *          type : string
     *          required: true
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
    requestPath: `/single-tracks/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      redisListResponse(req, res, next, singleTrackSearchHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/single-tracks/filter:
     *   get:
     *     tags:
     *      - Library Items => Single Tracks
     *     description: Filter Single Tracks
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
     *       - name: device_lang
     *         description: Specifies the language of device
     *         in: query
     *         schema:
     *          type : string
     *          required: true
     *          example: en
     *       - name: content_langs
     *         description: Specifies the comma separated languages of content
     *         in: query
     *         schema:
     *          type : string
     *          required: true
     *          example: en
     *       - name: content_types
     *         description: Specifies the Content type
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: talks
     *       - name: content_filters
     *         description: Specifies the Content filters
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: secular,spirituality
     *       - name: genres
     *         description: Specifies the Genres
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *       - name: topics
     *         description: Specifies the Topics
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          default: talks,music
     *          example: talks,music
     *       - name: voice_gender
     *         description: Specifies the Gender
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          default: MALE
     *          example: MALE
     *          enum: [MALE,FEMALE]
     *       - name: length_range
     *         description: Specifies the Length range
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: 1000TO2000
     *          default: 1000TO2000
     *       - name: length_option
     *         description: Specifies the Length Options
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: 5_10
     *          default: 5_10
     *       - name: publisher_ids
     *         description: Specifies the Publisher Ids
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: a4B2k0f1V7X5D8w6U0G0r7s8J5Q0G1z3t3V3p8Q8M5Y4z5T5P5R9X6E7L1N6v2V8M6Y2g2d9S2a2u5K2x7W0c3U3Y9D5X2c2K4K1,A8L6v7C8c7d2Y9C1d7J1k4D5F9k5L6D1C2Y4X4X9v8H2G8J4S2L0P1t0Q2B9A1n9s7s3p8v6Q7Z0y0G9Y7Z2V3m8N3Y0k8e7Q9m5
     *          default: a4B2k0f1V7X5D8w6U0G0r7s8J5Q0G1z3t3V3p8Q8M5Y4z5T5P5R9X6E7L1N6v2V8M6Y2g2d9S2a2u5K2x7W0c3U3Y9D5X2c2K4K1,A8L6v7C8c7d2Y9C1d7J1k4D5F9k5L6D1C2Y4X4X9v8H2G8J4S2L0P1t0Q2B9A1n9s7s3p8v6Q7Z0y0G9Y7Z2V3m8N3Y0k8e7Q9m5
     *       - name: ids
     *         description: Specifies the Ids
     *         in: query
     *         schema:
     *          type : string
     *          required: false
     *          example: f5q7x3u8g7p6v4y7n6u3k4d0r8e7x6e3y3c9w3q4,s0u1g7e7s1h2x6n1r8w6j2p4d0j4z9h8x7j1x8j8
     *          default: f5q7x3u8g7p6v4y7n6u3k4d0r8e7x6e3y3c9w3q4,s0u1g7e7s1h2x6n1r8w6j2p4d0j4z9h8x7j1x8j8
     *       - name: has_background_music
     *         description: Filter items with Background Music
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
     *          default: true
     *       - name: count_unique_publishers
     *         description: Count unique publishers
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: true
     *          default: false
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
     *          example: most_played
     *          enum: [ "most_played", "highest_rated", "newest","shortest","longest"]
     *          default: most_played
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
    requestPath: `/single-tracks/filter`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      redisListResponse(req, res, next, singleTrackFilterHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/single-tracks/{id}:
     *   get:
     *     tags:
     *      - Library Items => Single Tracks
     *     description: Get Single Track By ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Specifies value for Search
     *         in: path
     *         schema:
     *          type : string
     *          required: true
     *          example: z4t5t1f3w0d6e9d5z8z3c7c8z6s8f2c1s7a2q8z3
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    requestPath: `/single-tracks/:id`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      redisObjectResponse(req, res, next, singleTrackGetByIDHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/single-tracks/{id}/publisher-profile:
     *   get:
     *     tags:
     *      - Library Items => Single Tracks
     *     description: Get Single Tracks Publisher Profile By ID
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
    requestPath: `/single-tracks/:id/publisher-profile`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await singleTrackPublisherProfileHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.defaultHTTPSuccessResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisObjectResponse(req, res, next, singleTrackPublisherProfileHandler);
    },
  },
  {
    /**
     * @swagger
     *
     * /api/v1/single-tracks/{id}/reviews:
     *   get:
     *     tags:
     *      - Library Items => Single Tracks
     *     description: Get Single Track Reviews By ID
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
    requestPath: `/single-tracks/:id/reviews`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await singleTrackReviewsHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, singleTrackReviewsHandler);
    },
  },
];
