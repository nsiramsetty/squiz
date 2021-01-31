"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import path from 'path';
// import logger from '../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));
exports.default = (req, res, next) => {
    // log.info(`START :: ${req.method} :: ${req.originalUrl}`);
    next();
};
//# sourceMappingURL=route.logger.js.map