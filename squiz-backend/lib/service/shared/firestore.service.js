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
exports.getByIDFromFS = exports.getResultsFromFSQuery = exports.mergeMultipleTransformFromFSResponse = exports.transformFromFSResponse = exports.getFirestoreDocuments = exports.getFirestoreDocById = exports.transformFromFSResponses = exports.getSearchResultType = exports.getExtractDocPath = exports.getRequestHeader = exports.getBearerToken = void 0;
const axios_1 = __importDefault(require("axios"));
const admin = __importStar(require("firebase-admin"));
const http2_1 = require("http2");
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
const enum_1 = require("../../shared/enum");
const http_404_error_1 = __importDefault(require("../../shared/http/http-404-error"));
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
const logger_1 = __importDefault(require("../../shared/logger"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
// TODO: in future implementation
exports.getBearerToken = (userId) => {
    return `XXX - ${userId}`;
};
exports.getRequestHeader = (isCacheEnable) => {
    const requestHeader = {
        ContentType: 'application/json',
        'x-request-from': 'SEARCH_AND_FILTERING',
    };
    if (isCacheEnable) {
        Object.assign(requestHeader, { 'x-enable-caching': true });
    }
    return requestHeader;
};
exports.getExtractDocPath = (docPath) => {
    const docPathArr = docPath.split('/');
    return { documentID: docPathArr.pop(), collectionPath: docPathArr.join('/') };
};
function getSearchResultType(collection) {
    if (collection === enum_1.Collection.LIBRARY_ITEMS) {
        return enum_1.SearchResultType.LIBRARY_ITEMS;
    }
    if (collection === enum_1.Collection.COURSES) {
        return enum_1.SearchResultType.LIBRARY_ITEMS;
    }
    if (collection === enum_1.Collection.USERS) {
        return enum_1.SearchResultType.USERS;
    }
    if (collection === enum_1.Collection.GROUPS) {
        return enum_1.SearchResultType.GROUPS;
    }
    if (collection === enum_1.Collection.PLAYLISTS) {
        return enum_1.SearchResultType.PLAYLISTS;
    }
    if (collection === enum_1.Collection.EVENTS) {
        return enum_1.SearchResultType.EVENTS;
    }
    if (collection === enum_1.Collection.HASHTAGS) {
        return enum_1.SearchResultType.HASHTAGS;
    }
    if (collection === enum_1.Collection.EMAIL_DOMAIN) {
        return enum_1.SearchResultType.EMAIL_DOMAINS;
    }
    return enum_1.SearchResultType.UNKNOWN;
}
exports.getSearchResultType = getSearchResultType;
function transformFromFSResponses(responseDataObj, fsCollection, searchResultType) {
    const items = responseDataObj.data.map((responseData) => {
        const item = responseData;
        item.source = enum_1.ResultSource.FS;
        item.search_result_type = getSearchResultType(fsCollection);
        if (item.search_result_type === enum_1.SearchResultType.UNKNOWN && searchResultType) {
            item.search_result_type = searchResultType;
        }
        return item;
    });
    return { items, total: items.length };
}
exports.transformFromFSResponses = transformFromFSResponses;
exports.getFirestoreDocById = async (collectionPath, documentId, dashFields, isCacheEnable = true) => {
    const params = {
        collection: collectionPath,
        id: documentId,
    };
    const response = await axios_1.default
        .get(`${config_1.default.search.getFirestoreServiceBaseURL()}/document`, {
        headers: exports.getRequestHeader(isCacheEnable),
        params,
    })
        .then((responseData) => {
        var _a;
        if (!responseData || !responseData.data) {
            throw new http_404_error_1.default(`Document with id : ${documentId} is not found in ${collectionPath}`);
        }
        const document = (dashFields ? lodash_1.default.pick(responseData.data, dashFields) : responseData.data);
        if (!document) {
            throw new http_404_error_1.default(`Document with id : ${documentId} is not found in ${collectionPath}`);
        }
        if (((_a = config_1.default.gae.logs.level) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === enum_1.LogLevel.DEBUG) {
            document.source = enum_1.ResultSource.FS;
            document.search_result_type = getSearchResultType(collectionPath);
        }
        return { data: document };
    })
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        .catch((error) => {
        if (error.response && error.response.data) {
            const message = error.response.data.message || 'There is some technical issue';
            const statusCode = error.response.data.statusCode || http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
            throw new http_client_error_1.default(message, statusCode, '');
        }
        log.debug(`Document with path : ${collectionPath}/${documentId} is not found :: error :: ${error.message}`);
        return { data: null };
    });
    return response.data;
};
exports.getFirestoreDocuments = async (collectionPath, fsSearchConditions, fsSortConditions, offset, limit, fieldMasks, searchResultType, throwError = true, isCacheEnable = true) => {
    const params = Object.assign(Object.assign({ collection: collectionPath }, (offset && { offset })), (limit && { limit }));
    const requestedPayload = Object.assign(Object.assign(Object.assign({}, (fieldMasks && { fieldMasks })), (fsSearchConditions && { fsSearchConditions })), (fsSortConditions && { fsSortConditions }));
    const response = await axios_1.default
        .post(`${config_1.default.search.getFirestoreServiceBaseURL()}/documents`, requestedPayload, {
        headers: exports.getRequestHeader(isCacheEnable),
        params,
    })
        .then((responseData) => {
        return { data: transformFromFSResponses(responseData, collectionPath, searchResultType) };
    })
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        .catch((error) => {
        log.debug(`Document with path : ${collectionPath} is not found :: error :: ${error.message}`);
        if (throwError) {
            throw error;
        }
        return { data: null, error: error.message };
    });
    return response.data;
};
function transformFromFSResponse(snapshot, fsCollection, searchResultType) {
    const items = snapshot.docs.map((doc) => {
        const item = doc.data();
        item.id = item.id ? item.id : doc.ref.id;
        item.source = enum_1.ResultSource.FS;
        item.search_result_type = getSearchResultType(fsCollection);
        if (item.search_result_type === enum_1.SearchResultType.UNKNOWN && searchResultType) {
            item.search_result_type = searchResultType;
        }
        return item;
    });
    return { items, total: items.length };
}
exports.transformFromFSResponse = transformFromFSResponse;
function mergeMultipleTransformFromFSResponse(fsSearchTransformResponsesList, limit) {
    let items = [];
    fsSearchTransformResponsesList.forEach((fsSearchTransformResponse) => {
        items = items.concat(...fsSearchTransformResponse.items);
    });
    items = items.slice(0, limit);
    return { items, total: items.length };
}
exports.mergeMultipleTransformFromFSResponse = mergeMultipleTransformFromFSResponse;
function getResultsFromFSQuery(fsCollection, searchConditions, sortConditions, offset, limit, fieldMasks, searchResultType, throwError = true) {
    let fsCollectionQuery = admin.firestore().collection(fsCollection);
    searchConditions.forEach((condition) => {
        fsCollectionQuery = fsCollectionQuery.where(condition.fieldPath, condition.opStr, condition.value);
    });
    sortConditions.forEach((condition) => {
        fsCollectionQuery = fsCollectionQuery.orderBy(condition.fieldPath, condition.directionStr);
    });
    return fsCollectionQuery
        .select(...fieldMasks)
        .offset(offset)
        .limit(limit)
        .get()
        .then((snapshot) => {
        return transformFromFSResponse(snapshot, fsCollection, searchResultType);
    })
        .catch((error) => {
        log.error(`Error while retrieving results from Firestore :: ${error}`);
        if (throwError) {
            throw error;
        }
        return { total: 0, items: [] };
    });
}
exports.getResultsFromFSQuery = getResultsFromFSQuery;
function getByIDFromFS(documentID, fsCollection, dashFields) {
    const fsCollectionQuery = admin.firestore().doc(`/${fsCollection}/${documentID}`);
    return fsCollectionQuery.get().then((snapshot) => {
        var _a;
        if (!snapshot.exists || !snapshot.data()) {
            throw new http_404_error_1.default(`Document with id : ${documentID} is not found in ${fsCollection}`);
        }
        const document = (dashFields
            ? lodash_1.default.pick(snapshot.data(), dashFields)
            : snapshot.data());
        if (!document) {
            throw new http_404_error_1.default(`Document with id : ${documentID} is not found in ${fsCollection}`);
        }
        if (!document.id) {
            document.id = snapshot.ref.id;
        }
        if (((_a = config_1.default.gae.logs.level) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === enum_1.LogLevel.DEBUG) {
            document.source = enum_1.ResultSource.FS;
            document.search_result_type = getSearchResultType(fsCollection);
        }
        return document;
    });
}
exports.getByIDFromFS = getByIDFromFS;
//# sourceMappingURL=firestore.service.js.map