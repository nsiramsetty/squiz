import cls from 'cls-hooked';
import winston from 'winston';
// import axios from 'axios';
import shortid from 'shortid';
import config from '../config';
import { CORRELATION_NAMESPACE } from '../middleware/correlation.handler';

export function getCorrelationId(): string {
  const ns = cls.getNamespace(CORRELATION_NAMESPACE);
  return ns && ns.get('correlationID');
}

const loggingFormatConsole = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message }): string => {
    return `${process.env.NODE_ENV !== 'production' ? `[${timestamp}]` : ''}[${config.gae.app.name}][${level}][${
      getCorrelationId() || shortid.generate()
    }] :: ${message}`;
  }),
);

const loggingTransports = [];
loggingTransports.push(
  new winston.transports.Console({
    format: loggingFormatConsole,
    handleExceptions: true,
  }),
);

const loggerInstance = winston.createLogger({
  level: config.gae.logs.level,
  levels: winston.config.npm.levels,
  transports: loggingTransports,
  exitOnError: false,
});

interface Logger {
  error(text: string): void;
  info(text: string): void;
  warn(text: string): void;
  debug(text: string | object | number | boolean): void;
  json(data: object): void;
}

/* function slackNotify(text: string): void {
  axios
    .post(config.gae.app.slackURL, {
      attachments: [
        {
          color: 'rgba(255,0,0,1)',
          pretext: `:warning: Error in Application ${process.env.GOOGLE_CLOUD_PROJECT}::${config.gae.app.name}`,
          fields: [
            {
              title: 'Message',
              value: `${text}`,
              short: false,
            },
          ],
        },
        {
          color: 'rgba(0,0,255,1)',
          title: 'Go To Application',
          // eslint-disable-next-line @typescript-eslint/camelcase
          title_link: `https://console.cloud.google.com/appengine/versions?cloudshell=false&project=${process.env.GOOGLE_CLOUD_PROJECT}&serviceId=${config.gae.app.name}`,
        },
      ],
    })
    .then((): void => {})
    .catch((): void => {});
} */

export default (filename: string): Logger => {
  return {
    error(text: string): void {
      loggerInstance.error(`${filename} :: ${text}`);
      if (process.env.NODE_ENV === 'production') {
        // slackNotify(text);
      }
    },
    info(text: string): void {
      loggerInstance.info(`${filename} :: ${text}`);
    },
    warn(text: string): void {
      loggerInstance.warn(`${filename} :: ${text}`);
    },
    debug(text: string | object | number | boolean): void {
      if (typeof text === 'string') {
        loggerInstance.debug(`${filename} :: ${text}`);
      } else {
        try {
          loggerInstance.debug(`${filename} :: ${JSON.stringify(text, null, 2)}`);
        } catch (e) {
          loggerInstance.error(e.stack);
        }
      }
    },
    json(data: object): void {
      try {
        loggerInstance.info(`${filename} :: ${JSON.stringify(data, null, 2)}`);
      } catch (e) {
        loggerInstance.error(e.stack);
      }
    },
  };
};
