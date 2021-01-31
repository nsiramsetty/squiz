import preProdConfig from '../environments/preprod.config';
import prodConfig from '../environments/production.config';

export class AppConfig {
  public elasticSearchDefaultCluster!: ElasticSearchCluster;

  public elasticSearchActivityCluster!: ElasticSearchCluster;

  public cacheControl!: CacheControl;

  public redisCluster!: RedisCluster;

  public redisCacheControl!: RedisCacheControl;

  public redisKeyPrefix!: string;

  public mySqlConfig!: MySQlConfig;

  private firestoreServiceBaseURL!: string;

  public getFirestoreServiceBaseURL(): string {
    return this.firestoreServiceBaseURL;
  }

  public constructor() {
    switch (process.env.GOOGLE_CLOUD_PROJECT) {
      case 'insight-timer-a1ac7':
        Object.assign(this, prodConfig);
        break;
      case 'insight-timer-preprod':
        Object.assign(this, preProdConfig);
        break;
      default:
        Object.assign(this, preProdConfig);
        break;
    }
  }
}

export interface ElasticSearchCluster {
  host: string;
  username: string;
  password: string;
}

export interface CacheControl {
  maxAge: number;
}

export interface RedisCluster {
  host: string;
  port: number;
}

export interface RedisCacheControl {
  cacheDuration: number;
  recacheInterval: number;
}

export interface MySQlConfig {
  user: string;
  host: string;
  password: string;
  database: string;
  multipleStatements: boolean;
  connectTimeout: number;
  acquireTimeout: number;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
  debug: boolean;
}
