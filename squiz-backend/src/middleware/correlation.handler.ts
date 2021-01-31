import cls, { Namespace } from 'cls-hooked';
import shortid from 'shortid';
import { NextFunction, Request, Response } from 'express';

export const CORRELATION_NAMESPACE = 'CORRELATION';

function correlation(namespace: Namespace): (req: Request, res: Response, next: NextFunction) => void {
  if (!namespace) throw new Error('CLS namespace required');

  return function clsfyMiddleware(req: Request, res: Response, next: NextFunction): void {
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);

    namespace.run((): void => {
      const correlationID = shortid.generate();
      cls.getNamespace(CORRELATION_NAMESPACE).set('correlationID', correlationID);
      next();
    });
  };
}

export default correlation;
