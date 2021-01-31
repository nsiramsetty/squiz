"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    elasticSearchDefaultCluster: {
        host: 'https://9a0807bbc578448481ed92df76576cfc.us-central1.gcp.cloud.es.io:9243',
        username: 'elastic',
        password: 'Y5XBgLT85aI8s7ALENldTT47',
    },
    elasticSearchActivityCluster: {
        host: 'https://9a0807bbc578448481ed92df76576cfc.us-central1.gcp.cloud.es.io:9243',
        username: 'elastic',
        password: 'Y5XBgLT85aI8s7ALENldTT47',
    },
    cacheControl: {
        maxAge: 300,
    },
    redisCluster: {
        host: '10.34.17.3',
        port: 6379,
    },
    redisCacheControl: {
        cacheDuration: 86400,
        recacheInterval: 300,
    },
    redisKeyPrefix: '_express_search_and_filtering_',
    mySqlConfig: {
        multipleStatements: true,
        connectTimeout: 15000,
        acquireTimeout: 50000,
        waitForConnections: true,
        connectionLimit: 1000,
        queueLimit: 5000,
        debug: false,
    },
    firestoreServiceBaseURL: 'https://firestore-service-dot-insight-timer-preprod.appspot.com/api/v1',
};
//# sourceMappingURL=preprod.config.js.map