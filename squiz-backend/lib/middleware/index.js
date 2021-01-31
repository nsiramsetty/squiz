"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganLogger = exports.routeLogger = exports.errorHandler = void 0;
const error_handler_1 = __importDefault(require("./error.handler"));
exports.errorHandler = error_handler_1.default;
const route_logger_1 = __importDefault(require("./route.logger"));
exports.routeLogger = route_logger_1.default;
const morgan_logger_1 = __importDefault(require("./morgan.logger"));
exports.morganLogger = morgan_logger_1.default;
//# sourceMappingURL=index.js.map