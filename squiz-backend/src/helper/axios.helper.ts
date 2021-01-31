import axios, { AxiosPromise } from 'axios';
import { RequestBodySearch } from 'elastic-builder';
import { IncomingHttpHeaders } from 'http';
import * as https from 'https';
// import path from 'path';
import config from '../config';
import { ElasticSearchCluster } from '../config/model/search.model';
import { ES_REQUEST_TIMEOUT_IN_MS } from '../shared/constants';
// import logger from '../shared/logger';

// const log = logger(path.relative(process.cwd(), __filename));

const keepAliveAgent = new https.Agent({ keepAlive: true });

export class ESClient {
  private readonly host: string;

  private readonly basicAuth: string;

  public constructor(elasticSearchConfig: ElasticSearchCluster) {
    this.host = elasticSearchConfig.host;
    const authString = `${elasticSearchConfig.username}:${elasticSearchConfig.password}`;
    this.basicAuth = `Basic ${Buffer.from(authString).toString('base64')}`;
  }

  public post(action: string, data: RequestBodySearch | string | { ids: string[] } | object): AxiosPromise {
    const url = this.getUrl(action);
    return axios.post(url, data, {
      headers: this.getHeaders(),
      timeout: ES_REQUEST_TIMEOUT_IN_MS,
      httpsAgent: keepAliveAgent,
    });
  }

  public put(action: string, data: string): AxiosPromise {
    const url = this.getUrl(action);
    return axios.put(url, data, {
      headers: this.getHeaders(),
      httpsAgent: keepAliveAgent,
    });
  }

  public delete(action: string): AxiosPromise {
    const url = this.getUrl(action);
    return axios.delete(url, {
      headers: this.getHeaders(),
      httpsAgent: keepAliveAgent,
    });
  }

  public get(action: string): AxiosPromise {
    const url = this.getUrl(action);
    return axios.get(url, {
      headers: this.getHeaders(),
      httpsAgent: keepAliveAgent,
    });
  }

  public head(action: string): AxiosPromise {
    const url = this.getUrl(action);
    return axios.head(url, {
      headers: this.getHeaders(),
      httpsAgent: keepAliveAgent,
    });
  }

  private getUrl(action: string): string {
    if (this.host.endsWith('/')) {
      return `${this.host}/${action}`;
    }
    return `${this.host}/${action}`;
  }

  private getHeaders(): IncomingHttpHeaders {
    return {
      Authorization: this.basicAuth,
      'Content-Type': 'application/json',
    };
  }
}
export const ESDefaultClient = new ESClient(config.search.elasticSearchDefaultCluster);
export const ESActivityClient = new ESClient(config.search.elasticSearchActivityCluster);
