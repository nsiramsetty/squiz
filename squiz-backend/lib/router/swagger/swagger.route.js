"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRouter = void 0;
const express_1 = require("express");
const app_1 = require("../../app");
exports.swaggerRouter = express_1.Router();
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
exports.swaggerRouter.get(`/swagger.json`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(app_1.swaggerSpec);
});
exports.swaggerRouter.get(`/`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(app_1.swaggerSpec);
});
exports.default = { swaggerRouter: exports.swaggerRouter };
//# sourceMappingURL=swagger.route.js.map