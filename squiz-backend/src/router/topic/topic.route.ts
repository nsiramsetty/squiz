import { NextFunction, Request, Response } from 'express';
import { topicsFilterHandler } from '../../handler/topic/topic.handler';
import { redisListResponse } from '../../service/shared/redis.service';

export default [
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
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await topicsFilterHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, topicsFilterHandler);
    },
  },
];
