"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const redis_1 = __importDefault(require("redis"));
const logger_1 = __importDefault(require("../../shared/logger"));
const index_1 = __importDefault(require("../index"));
const REDIS_HOST = index_1.default.search.redisCluster.host;
const REDIS_PORT = index_1.default.search.redisCluster.port;
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
class RedisConfigService {
    static initConnection() {
        this.redisClient = redis_1.default.createClient(+REDIS_PORT || 6379, REDIS_HOST);
        this.redisClient.on('connect', (err) => {
            if (err)
                log.error(`error in redis connection ${JSON.stringify(err)}`);
            log.info('connected to redis successfully');
        });
        this.redisClient.on('error', (err) => {
            log.error(`error in redis ${JSON.stringify(err)}`);
            this.redisClient.quit();
        });
    }
    static getRedisClient() {
        if (this.redisClient) {
            return this.redisClient;
        }
        this.initConnection();
        return this.redisClient;
    }
}
exports.default = RedisConfigService;
//# sourceMappingURL=redis.config.js.map