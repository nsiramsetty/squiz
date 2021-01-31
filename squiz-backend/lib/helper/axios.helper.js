"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESActivityClient = exports.ESDefaultClient = exports.ESClient = void 0;
const axios_1 = __importDefault(require("axios"));
const https = __importStar(require("https"));
// import path from 'path';
const config_1 = __importDefault(require("../config"));
const constants_1 = require("../shared/constants");
// import logger from '../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));
const keepAliveAgent = new https.Agent({ keepAlive: true });
class ESClient {
    constructor(elasticSearchConfig) {
        this.host = elasticSearchConfig.host;
        const authString = `${elasticSearchConfig.username}:${elasticSearchConfig.password}`;
        this.basicAuth = `Basic ${Buffer.from(authString).toString('base64')}`;
    }
    post(action, data) {
        const url = this.getUrl(action);
        return axios_1.default.post(url, data, {
            headers: this.getHeaders(),
            timeout: constants_1.ES_REQUEST_TIMEOUT_IN_MS,
            httpsAgent: keepAliveAgent,
        });
    }
    put(action, data) {
        const url = this.getUrl(action);
        return axios_1.default.put(url, data, {
            headers: this.getHeaders(),
            httpsAgent: keepAliveAgent,
        });
    }
    delete(action) {
        const url = this.getUrl(action);
        return axios_1.default.delete(url, {
            headers: this.getHeaders(),
            httpsAgent: keepAliveAgent,
        });
    }
    get(action) {
        const url = this.getUrl(action);
        return axios_1.default.get(url, {
            headers: this.getHeaders(),
            httpsAgent: keepAliveAgent,
        });
    }
    head(action) {
        const url = this.getUrl(action);
        return axios_1.default.head(url, {
            headers: this.getHeaders(),
            httpsAgent: keepAliveAgent,
        });
    }
    getUrl(action) {
        if (this.host.endsWith('/')) {
            return `${this.host}/${action}`;
        }
        return `${this.host}/${action}`;
    }
    getHeaders() {
        return {
            Authorization: this.basicAuth,
            'Content-Type': 'application/json',
        };
    }
}
exports.ESClient = ESClient;
exports.ESDefaultClient = new ESClient(config_1.default.search.elasticSearchDefaultCluster);
exports.ESActivityClient = new ESClient(config_1.default.search.elasticSearchActivityCluster);
//# sourceMappingURL=axios.helper.js.map