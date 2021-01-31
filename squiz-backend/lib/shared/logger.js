"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrelationId = void 0;
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const winston_1 = __importDefault(require("winston"));
// import axios from 'axios';
const shortid_1 = __importDefault(require("shortid"));
const config_1 = __importDefault(require("../config"));
const correlation_handler_1 = require("../middleware/correlation.handler");
function getCorrelationId() {
    const ns = cls_hooked_1.default.getNamespace(correlation_handler_1.CORRELATION_NAMESPACE);
    return ns && ns.get('correlationID');
}
exports.getCorrelationId = getCorrelationId;
const loggingFormatConsole = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message }) => {
    return `${process.env.NODE_ENV !== 'production' ? `[${timestamp}]` : ''}[${config_1.default.gae.app.name}][${level}][${getCorrelationId() || shortid_1.default.generate()}] :: ${message}`;
}));
const loggingTransports = [];
loggingTransports.push(new winston_1.default.transports.Console({
    format: loggingFormatConsole,
    handleExceptions: true,
}));
const loggerInstance = winston_1.default.createLogger({
    level: config_1.default.gae.logs.level,
    levels: winston_1.default.config.npm.levels,
    transports: loggingTransports,
    exitOnError: false,
});
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
exports.default = (filename) => {
    return {
        error(text) {
            loggerInstance.error(`${filename} :: ${text}`);
            if (process.env.NODE_ENV === 'production') {
                // slackNotify(text);
            }
        },
        info(text) {
            loggerInstance.info(`${filename} :: ${text}`);
        },
        warn(text) {
            loggerInstance.warn(`${filename} :: ${text}`);
        },
        debug(text) {
            if (typeof text === 'string') {
                loggerInstance.debug(`${filename} :: ${text}`);
            }
            else {
                try {
                    loggerInstance.debug(`${filename} :: ${JSON.stringify(text, null, 2)}`);
                }
                catch (e) {
                    loggerInstance.error(e.stack);
                }
            }
        },
        json(data) {
            try {
                loggerInstance.info(`${filename} :: ${JSON.stringify(data, null, 2)}`);
            }
            catch (e) {
                loggerInstance.error(e.stack);
            }
        },
    };
};
//# sourceMappingURL=logger.js.map