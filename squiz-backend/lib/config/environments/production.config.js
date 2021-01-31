"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    elasticSearchDefaultCluster: {
        host: 'https://9b5bc8ba250948f6a87f5cc0a1ce8c6d.us-central1.gcp.cloud.es.io:9243',
        username: 'elastic',
        password: '5toc8rcMzzs3spCDXTLCV9f4',
    },
    elasticSearchActivityCluster: {
        host: 'https://df0f7e36d3a042ea8f57e306bb26c5da.us-central1.gcp.cloud.es.io:9243',
        username: 'elastic',
        password: 'mtJlQ7DyLd45XdSP10FjafOf',
    },
    cacheControl: {
        maxAge: 300,
    },
    redisCluster: {
        host: '10.45.33.11',
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
    firestoreServiceBaseURL: 'https://firestore-service-dot-insight-timer-a1ac7.appspot.com/api/v1',
};
//# sourceMappingURL=production.config.js.map