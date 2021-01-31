import { NextFunction, Request, Response } from 'express';
import audioSearchHandler from '../../handler/library-item/audio.handler';
import { redisListResponse } from '../../service/shared/redis.service';

export default [
  {
    /**
     * @swagger
     *
     * /api/v1/audio/search:
     *   get:
     *     tags:
     *      - Audio
     *     description: Search in Library Items.
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
     *       - name: single_tracks_only
     *         description: Specifies if only single tracks
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: false
     *       - name: is_science
     *         description: Filter Science
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: false
     *       - name: is_religion
     *         description: Filter Religion
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: false
     *       - name: is_secular
     *         description: Filter Secular
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: false
     *       - name: is_newage
     *         description: Filter NewAge
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: false
     *       - name: is_spiritual
     *         description: Filter Spirituality
     *         in: query
     *         schema:
     *          type : boolean
     *          required: false
     *          example: false
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
    requestPath: `/audio/search`,
    method: 'GET',
    handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // try {
      //   const result = await audioSearchHandler(new HttpRequestContext(req, res, next));
      //   responseBuilder.searchResultsResponse(res, result);
      // } catch (error) {
      //   errorHandler(error, req, res, next);
      // }
      redisListResponse(req, res, next, audioSearchHandler);
    },
  },
];
