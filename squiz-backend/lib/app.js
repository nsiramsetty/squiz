"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const method_override_1 = __importDefault(require("method-override"));
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = __importDefault(require("./config"));
const middleware_1 = require("./middleware");
const correlation_handler_1 = __importStar(require("./middleware/correlation.handler"));
const router_1 = require("./router");
const health_route_1 = require("./router/health/health.route");
const swagger_route_1 = require("./router/swagger/swagger.route");
const logger_1 = __importDefault(require("./shared/logger"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
const app = express_1.default();
// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// It shows the real origin IP in the heroku or Cloudwatch logs
app.enable('trust proxy');
// The magic package that prevents frontend developers going nuts
// Alternate description:
// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors_1.default({
    exposedHeaders: ['x-total-count'],
}));
// Some sauce that always add since 2014
// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
// Maybe not needed anymore ?
app.use(correlation_handler_1.default(cls_hooked_1.default.createNamespace(correlation_handler_1.CORRELATION_NAMESPACE)));
app.use(method_override_1.default());
// Middleware that transforms the raw string of req.body into json
app.use(body_parser_1.default.json());
// Logs all the the requests and Types
app.use(middleware_1.routeLogger);
// Logs the Response Size and Time Taken
app.use(middleware_1.morganLogger);
// Configure Swagger-JSDoc
const options = {
    definition: {
        openapi: '3.0.0',
        basePath: '/',
        schemes: ['http', 'https'],
        host: process.env.GOOGLE_CLOUD_PROJECT
            ? `${config_1.default.gae.app.name}-dot-${process.env.GOOGLE_CLOUD_PROJECT}.uc.r.appspot.com`
            : 'localhost:8080',
        produces: ['application/json'],
        info: {
            title: 'Search and Filtering AppEngine',
            version: '1.0.0',
        },
    },
    // Path to the API docs
    apis: [__filename, `${path_1.default.resolve(__dirname, './')}/router/**/*.route.js`],
};
exports.swaggerSpec = swagger_jsdoc_1.default(options);
app.use('/api/docs/', swagger_route_1.swaggerRouter);
// Configure Swagger UI
app.use('/api-docs/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
// Configure Application routes
app.use(config_1.default.gae.api.prefix, router_1.router);
/**
 * Health Check endpoints
 */
app.use('/', health_route_1.healthRouter);
// Error Handling
app.use(middleware_1.errorHandler);
exports.default = app;
async function startServer() {
    // Start the Application
    return app.listen(parseInt(process.env.PORT || '8080', 10), (err) => {
        // Handle this below.
        if (err) {
            log.error(err.stack);
        }
    });
}
startServer()
    .then(() => {
    log.debug(`#############################################################`);
    // Enable below 2 lines to see the environment
    log.debug(`🛡️                   Environment                           🛡️ `);
    log.debug(JSON.stringify(config_1.default, null, 2));
    log.info(`🛡️         Application Started Successfully!!              🛡️ `);
    log.debug(`#############################################################`);
})
    .catch((err) => {
    log.error(`#############################################################`);
    log.error(`⚠️  Failed to Start Application: Error ⚠️ `);
    log.error(JSON.stringify(err));
    log.error(`#############################################################`);
});
//# sourceMappingURL=app.js.map