"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_handler_1 = require("../../handler/topic/topic.handler");
const redis_service_1 = require("../../service/shared/redis.service");
exports.default = [
    {
        /**
         * @swagger
         *
         * /api/v1/topics/filter:
         *   get:
         *     tags:
         *      - Topics
         *     description: Filter Topics.
         *     produces:
         *       - application/json
         *     parameters:
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
         *     responses:
         *       200:
         *         description: Ok
         *       400:
         *         description: Bad Request
         *       500:
         *         description: Internal Server Error
         */
        requestPath: `/topics/filter`,
        method: 'GET',
        handler: async (req, res, next) => {
            // try {
            //   const result = await topicsFilterHandler(new HttpRequestContext(req, res, next));
            //   responseBuilder.searchResultsResponse(res, result);
            // } catch (error) {
            //   errorHandler(error, req, res, next);
            // }
            redis_service_1.redisListResponse(req, res, next, topic_handler_1.topicsFilterHandler);
        },
    },
];
//# sourceMappingURL=topic.route.js.map