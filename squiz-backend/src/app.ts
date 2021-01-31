import bodyParser from 'body-parser';
import cls from 'cls-hooked';
import cors from 'cors';
import express from 'express';
import * as http from 'http';
import methodOverride from 'method-override';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import config from './config';
import { errorHandler, morganLogger, routeLogger } from './middleware';
import correlation, { CORRELATION_NAMESPACE } from './middleware/correlation.handler';
import { router } from './router';
import { healthRouter } from './router/health/health.route';
import { swaggerRouter } from './router/swagger/swagger.route';
import logger from './shared/logger';

const log = logger(path.relative(process.cwd(), __filename));

const app = express();
// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// It shows the real origin IP in the heroku or Cloudwatch logs
app.enable('trust proxy');
// The magic package that prevents frontend developers going nuts
// Alternate description:
// Enable Cross Origin Resource Sharing to all origins by default
app.use(
  cors({
    exposedHeaders: ['x-total-count'],
  }),
);
// Some sauce that always add since 2014
// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
// Maybe not needed anymore ?
app.use(correlation(cls.createNamespace(CORRELATION_NAMESPACE)));
app.use(methodOverride());
// Middleware that transforms the raw string of req.body into json
app.use(bodyParser.json());
// Logs all the the requests and Types
app.use(routeLogger);
// Logs the Response Size and Time Taken
app.use(morganLogger);
// Configure Swagger-JSDoc
const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0'),
    basePath: '/',
    schemes: ['http', 'https'],
    host: process.env.GOOGLE_CLOUD_PROJECT
      ? `${config.gae.app.name}-dot-${process.env.GOOGLE_CLOUD_PROJECT}.uc.r.appspot.com`
      : 'localhost:8080',
    produces: ['application/json'],
    info: {
      title: 'Search and Filtering AppEngine', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: [__filename, `${path.resolve(__dirname, './')}/router/**/*.route.js`],
};
export const swaggerSpec = swaggerJSDoc(options);
app.use('/api/docs/', swaggerRouter);
// Configure Swagger UI
app.use('/api-docs/', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));
// Configure Application routes
app.use(config.gae.api.prefix, router);
/**
 * Health Check endpoints
 */
app.use('/', healthRouter);
// Error Handling
app.use(errorHandler);

export default app;

async function startServer(): Promise<http.Server> {
  // Start the Application
  return app.listen(parseInt(process.env.PORT || '8080', 10), (err): void => {
    // Handle this below.
    if (err) {
      log.error(err.stack);
    }
  });
}

startServer()
  .then((): void => {
    log.debug(`#############################################################`);
    // Enable below 2 lines to see the environment
    log.debug(`🛡️                   Environment                           🛡️ `);
    log.debug(JSON.stringify(config, null, 2));
    log.info(`🛡️         Application Started Successfully!!              🛡️ `);
    log.debug(`#############################################################`);
  })
  .catch((err): void => {
    log.error(`#############################################################`);
    log.error(`⚠️  Failed to Start Application: Error ⚠️ `);
    log.error(JSON.stringify(err));
    log.error(`#############################################################`);
  });
