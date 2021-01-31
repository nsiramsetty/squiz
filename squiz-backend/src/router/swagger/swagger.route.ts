import { Router } from 'express';
import { swaggerSpec } from '../../app';

export const swaggerRouter = Router();
/* fs.writeFile(
  `${path.resolve(__dirname, './')}/swagger.json`,
  JSON.stringify(swaggerSpec, null, 2),
  (err: Error | null): void => {
    if (err) throw err;
  },
); */
/**
 * @swagger
 *
 * /api/docs/swagger.json:
 *   get:
 *     tags:
 *      - Swagger
 *     description: Get the Swagger JSON
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
swaggerRouter.get(`/swagger.json`, (req, res): void => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

swaggerRouter.get(`/`, (req, res): void => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export default { swaggerRouter };
