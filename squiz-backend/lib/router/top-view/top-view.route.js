"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const top_view_handler_1 = require("../../handler/top-view/top-view.handler");
const redis_service_1 = require("../../service/shared/redis.service");
exports.default = [
    {
        /**
         * @swagger
         *
         * /api/v1/top:
         *   get:
         *     tags:
         *      - Top Search
         *     description: Search data for top view
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: device_lang
         *         description: Specifies the language of device
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: en
         *       - name: publishers_only_users
         *         description: Specifies the users as publishers as true or false
         *         in: query
         *         schema:
         *          type : boolean
         *          required: false
         *          example: true
         *       - name: query
         *         description: Specifies value tobe search
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: sleep
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
         *       - name: user_id
         *         description: Specifies user id value
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: f0w6N1B9Z1z7N8M5v7c5f4z5y1n6v9R0g7w6N9m9f1r7w0r6S8y8Q0k4Q1G8y6t4y6E5V2A2v6Y1n6U5M0K3E6K3V2A6r0y5u8H4
         *     responses:
         *       200:
         *         description: Ok
         *       400:
         *         description: Bad Request
         *       500:
         *         description: Internal Server Error
         */
        requestPath: `/top`,
        method: 'GET',
        handler: async (req, res, next) => {
            // try {
            //   const result: ResponseWrapperModel<UnifiedSearchResponse> = await topViewHandlerV2(
            //     new HttpRequestContext(req, res, next),
            //   );
            //   responseBuilder.searchResultsResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisListResponse(req, res, next, top_view_handler_1.topViewHandlerV2);
        },
    },
    {
        /**
         * @swagger
         *
         * /api/v1/top/v2:
         *   get:
         *     tags:
         *      - Top Search V2
         *     description: Search data for top view
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: device_lang
         *         description: Specifies the language of device
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: en
         *       - name: publishers_only_users
         *         description: Specifies the users as publishers as true or false
         *         in: query
         *         schema:
         *          type : boolean
         *          required: false
         *          example: true
         *       - name: query
         *         description: Specifies value tobe search
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: sleep
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
         *       - name: user_id
         *         description: Specifies user id value
         *         in: query
         *         schema:
         *          type : string
         *          required: false
         *          example: f0w6N1B9Z1z7N8M5v7c5f4z5y1n6v9R0g7w6N9m9f1r7w0r6S8y8Q0k4Q1G8y6t4y6E5V2A2v6Y1n6U5M0K3E6K3V2A6r0y5u8H4
         *     responses:
         *       200:
         *         description: Ok
         *       400:
         *         description: Bad Request
         *       500:
         *         description: Internal Server Error
         */
        requestPath: `/top/v2`,
        method: 'GET',
        handler: async (req, res, next) => {
            // try {
            //   const result: ResponseWrapperModel<UnifiedSearchResponse> = await topViewHandlerV2(
            //     new HttpRequestContext(req, res, next),
            //   );
            //   responseBuilder.searchResultsResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisListResponse(req, res, next, top_view_handler_1.topViewHandlerV2);
        },
    },
];
//# sourceMappingURL=top-view.route.js.map