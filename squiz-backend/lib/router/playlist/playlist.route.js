"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playlist_handler_1 = require("../../handler/playlist/playlist.handler");
const redis_service_1 = require("../../service/shared/redis.service");
exports.default = [
    {
        /**
         * @swagger
         *
         * /api/v1/playlists/search:
         *   get:
         *     tags:
         *      - Playlists
         *     description: Search in Playlists.
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
         *          required: false
         *          example: en
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
        requestPath: `/playlists/search`,
        method: 'GET',
        isRedisCachingEnabled: true,
        handler: async (req, res, next) => {
            // try {
            //   const result = await playlistSearchHandler(new HttpRequestContext(req, res, next));
            //   responseBuilder.searchResultsResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisListResponse(req, res, next, playlist_handler_1.playlistSearchHandler);
        },
    },
    {
        /**
         * @swagger
         *
         * /api/v1/playlists/filter:
         *   get:
         *     tags:
         *      - Playlists
         *     description: Filter in Playlists.
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: hashtags
         *         description: Specifies value for Search.
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: sleep
         *          default: sleep
         *       - name: sort_option
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: popular
         *          enum: [popular, newest]
         *          default: popular
         *       - name: sort_direction
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: desc
         *          enum: ["asc","desc"]
         *          default: desc
         *       - name: include_description
         *         description: Specifies value tobe include in Search Result.
         *         in: query
         *         schema:
         *          type : boolean
         *          required: false
         *          example: true
         *          default: true
         *       - name: region_name
         *         description: Specifies owner region name value tobe Search.
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: 'Sydney'
         *          default: 'Sydney'
         *       - name: query
         *         description: Specifies value for Search.
         *         in: query
         *         schema:
         *          type : string
         *          required: false
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
        requestPath: `/playlists/filter`,
        method: 'GET',
        handler: async (req, res, next) => {
            // try {
            //   const result = await playlistFilterHandler(new HttpRequestContext(req, res, next));
            //   responseBuilder.searchResultsResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisListResponse(req, res, next, playlist_handler_1.playlistFilterHandler);
        },
    },
    {
        /**
         * @swagger
         *
         * /api/v1/playlists/{id}:
         *   get:
         *     tags:
         *      - Playlists
         *     description: Get Playlist By ID
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         description: Specifies value for Search
         *         in: path
         *         schema:
         *          type : string
         *          required: true
         *          example: XtXQHoLfhEup40wwkp1b
         *     responses:
         *       200:
         *         description: Ok
         *       400:
         *         description: Bad Request
         *       500:
         *         description: Internal Server Error
         */
        requestPath: `/playlists/:id`,
        method: 'GET',
        handler: async (req, res, next) => {
            // try {
            //   const result = await playlistGetByIDHandler(new HttpRequestContext(req, res, next));
            //   responseBuilder.defaultHTTPSuccessResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisObjectResponse(req, res, next, playlist_handler_1.playlistGetByIDHandler);
        },
    },
    {
        /**
         * @swagger
         *
         * /api/v1/playlists/{id}/related:
         *   get:
         *     tags:
         *      - Playlists
         *     description: Get Related Playlist By ID
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         description: Specifies Playlist Id value for Search
         *         in: path
         *         schema:
         *          type : string
         *          required: true
         *          example: 0078DyAUbkYQ4kPEqMr6
         *       - name: include_description
         *         description: Specifies value tobe include in Search Result.
         *         in: query
         *         schema:
         *          type : boolean
         *          required: false
         *          example: true
         *          default: true
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
        requestPath: `/playlists/:id/related`,
        method: 'GET',
        handler: async (req, res, next) => {
            // try {
            //   const result = await relatedPlaylistByIDHandler(new HttpRequestContext(req, res, next));
            //   responseBuilder.searchResultsResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisListResponse(req, res, next, playlist_handler_1.relatedPlaylistByIDHandler);
        },
    },
    {
        /**
         * @swagger
         *
         * /api/v1/playlists/{id}/other-playlists-from-user:
         *   get:
         *     tags:
         *      - Playlists
         *     description: Get Other Playlist of Owner By Playlist Id
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         description: Specifies Playlist Id value for Search
         *         in: path
         *         schema:
         *          type : string
         *          required: true
         *          example: 0078DyAUbkYQ4kPEqMr6
         *       - name: include_description
         *         description: Specifies value tobe include in Search Result.
         *         in: query
         *         schema:
         *          type : boolean
         *          required: false
         *          example: true
         *          default: true
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
        requestPath: `/playlists/:id/other-playlists-from-user`,
        method: 'GET',
        handler: async (req, res, next) => {
            // try {
            //   const result = await otherPlaylistByIDHandler(new HttpRequestContext(req, res, next));
            //   responseBuilder.searchResultsResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisListResponse(req, res, next, playlist_handler_1.otherPlaylistByIDHandler);
        },
    },
];
//# sourceMappingURL=playlist.route.js.map