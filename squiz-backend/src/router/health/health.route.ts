import { Router } from 'express';

export const healthRouter = Router();

/**
 * @swagger
 *
 * /:
 *   get:
 *     tags:
 *      - Health
 *     description: Provides the status of application
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
healthRouter.get(`/`, (req, res): void => {
  res.status(200).send({
    status: 'Up',
    environment: {
      GAE_APPLICATION: process.env.GAE_APPLICATION,
      GAE_DEPLOYMENT_ID: process.env.GAE_DEPLOYMENT_ID,
      GAE_ENV: process.env.GAE_ENV,
      GAE_INSTANCE: process.env.GAE_INSTANCE,
      GAE_MEMORY_MB: process.env.GAE_MEMORY_MB,
      GAE_RUNTIME: process.env.GAE_RUNTIME,
      GAE_SERVICE: process.env.GAE_SERVICE,
      GAE_VERSION: process.env.GAE_VERSION,
      GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    },
  });
});
/**
 * @swagger
 *
 * /:
 *   head:
 *     tags:
 *      - Health
 *     description: Provides the status of application
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
healthRouter.head(`/`, (req, res): void => {
  res.status(200).end();
});

export default { healthRouter };
