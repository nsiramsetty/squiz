import morgan from 'morgan';
import path from 'path';
import config from '../config';
import { getCorrelationId } from '../shared/logger';

export default morgan((tokens, req, res): string => {
  return [
    `${process.env.NODE_ENV !== 'production' ? `[${new Date().toISOString()}]` : ''}[${
      config.gae.app.name
    }][info][${getCorrelationId()}] :: ${path.relative(process.cwd(), __filename)} :: END ::`,
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
