import { NextFunction, Request, Response } from 'express';
// import path from 'path';
// import logger from '../shared/logger';

// const log = logger(path.relative(process.cwd(), __filename));

export default (req: Request, res: Response, next: NextFunction): void => {
  // log.info(`START :: ${req.method} :: ${req.originalUrl}`);
  next();
};
