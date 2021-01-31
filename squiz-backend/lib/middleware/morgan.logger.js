"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const logger_1 = require("../shared/logger");
exports.default = morgan_1.default((tokens, req, res) => {
    return [
        `${process.env.NODE_ENV !== 'production' ? `[${new Date().toISOString()}]` : ''}[${config_1.default.gae.app.name}][info][${logger_1.getCorrelationId()}] :: ${path_1.default.relative(process.cwd(), __filename)} :: END ::`,
        tokens.method(req, res),
        `::`,
        tokens.url(req, res),
        `::`,
        tokens.status(req, res),
        `::`,
        tokens.res(req, res, 'content-length'),
        '::',
        tokens.res(req, res, 'x-total-count') || 0,
        '::',
        tokens['response-time'](req, res),
        'ms',
    ].join(' ');
});
//# sourceMappingURL=morgan.logger.js.map