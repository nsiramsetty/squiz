import path from 'path';
import redis, { RedisClient } from 'redis';
import logger from '../../shared/logger';
import config from '../index';

const REDIS_HOST = config.search.redisCluster.host;
const REDIS_PORT = config.search.redisCluster.port;

const log = logger(path.relative(process.cwd(), __filename));

export default class RedisConfigService {
  public static redisClient: RedisClient;

  private static initConnection(): void {
    this.redisClient = redis.createClient(+REDIS_PORT || 6379, REDIS_HOST);
    this.redisClient.on('connect', (err): void => {
      if (err) log.error(`error in redis connection ${JSON.stringify(err)}`);
      log.info('connected to redis successfully');
    });
    this.redisClient.on('error', (err): void => {
      log.error(`error in redis ${JSON.stringify(err)}`);
      this.redisClient.quit();
    });
  }

  public static getRedisClient(): RedisClient {
    if (this.redisClient) {
      return this.redisClient;
    }
    this.initConnection();
    return this.redisClient;
  }
}
