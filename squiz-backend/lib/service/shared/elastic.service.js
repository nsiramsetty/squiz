"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentsByIDListFromES = exports.transformFromMultiDocumentESResponse = exports.getDocumentByIDFromES = exports.getMultiIndexResultsFromES = exports.transformFromMultiIndexESResponse = exports.getSingleIndexResultsFromES = exports.transformFromSingleIndexESResponse = exports.getSearchResultType = exports.setSearchResultType = void 0;
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
const axios_helper_1 = require("../../helper/axios.helper");
const enum_1 = require("../../shared/enum");
const http_404_error_1 = __importDefault(require("../../shared/http/http-404-error"));
const logger_1 = __importDefault(require("../../shared/logger"));
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function setSearchResultType(pHit) {
    const hit = pHit;
    if (hit._index.indexOf(enum_1.ESIndexName.LIBRARY_ITEMS) >= 0) {
        hit._source.search_result_type = enum_1.SearchResultType.LIBRARY_ITEMS;
    }
    else if (hit._index.indexOf(enum_1.ESIndexName.USERS) >= 0) {
        hit._source.search_result_type = enum_1.SearchResultType.USERS;
    }
    else if (hit._index.indexOf(enum_1.ESIndexName.GROUPS) >= 0) {
        hit._source.search_result_type = enum_1.SearchResultType.GROUPS;
    }
    else if (hit._index.indexOf(enum_1.ESIndexName.PLAYLISTS) >= 0) {
        hit._source.search_result_type = enum_1.SearchResultType.PLAYLISTS;
    }
    else if (hit._index.indexOf(enum_1.ESIndexName.EVENTS) >= 0) {
        hit._source.search_result_type = enum_1.SearchResultType.EVENTS;
    }
    else if (hit._index.indexOf(enum_1.ESIndexName.HASHTAGS) >= 0) {
        hit._source.search_result_type = enum_1.SearchResultType.HASHTAGS;
    }
    return hit;
}
exports.setSearchResultType = setSearchResultType;
function getSearchResultType(hit) {
    if (hit._index.indexOf(enum_1.ESIndexName.LIBRARY_ITEMS) >= 0) {
        return enum_1.SearchResultType.LIBRARY_ITEMS;
    }
    if (hit._index.indexOf(enum_1.ESIndexName.USERS) >= 0) {
        return enum_1.SearchResultType.USERS;
    }
    if (hit._index.indexOf(enum_1.ESIndexName.GROUPS) >= 0) {
        return enum_1.SearchResultType.GROUPS;
    }
    if (hit._index.indexOf(enum_1.ESIndexName.PLAYLISTS) >= 0) {
        return enum_1.SearchResultType.PLAYLISTS;
    }
    if (hit._index.indexOf(enum_1.ESIndexName.EVENTS) >= 0) {
        return enum_1.SearchResultType.EVENTS;
    }
    if (hit._index.indexOf(enum_1.ESIndexName.HASHTAGS) >= 0) {
        return enum_1.SearchResultType.HASHTAGS;
    }
    if (hit._index.indexOf(enum_1.ESIndexName.USER_RELATIONS) >= 0) {
        return enum_1.SearchResultType.USER_RELATION;
    }
    if (hit._index.indexOf(enum_1.ESIndexName.EMAIL_DOMAIN) >= 0) {
        return enum_1.SearchResultType.EMAIL_DOMAINS;
    }
    return enum_1.SearchResultType.UNKNOWN;
}
exports.getSearchResultType = getSearchResultType;
function transformFromSingleIndexESResponse(response, searchResultType) {
    let total = 0;
    let items = [];
    if (response.data && response.data.hits) {
        const esResult = response.data.hits;
        if (esResult.hits.length > 0) {
            total += esResult.total;
            items = esResult.hits.map((hit) => {
                const searchType = searchResultType || getSearchResultType(hit);
                Object.assign(hit._source, { search_result_type: searchType });
                Object.assign(hit._source, { source: enum_1.ResultSource.ES });
                Object.assign(hit._source, { score: hit._score || 0 });
                return hit._source;
            });
        }
    }
    return { items, total };
}
exports.transformFromSingleIndexESResponse = transformFromSingleIndexESResponse;
async function getSingleIndexResultsFromES(esIndex, esQuery, throwError = true, esClient, searchResultType) {
    const client = esClient || axios_helper_1.ESDefaultClient;
    return client
        .post(`${esIndex}/_search`, `${JSON.stringify(esQuery)}`)
        .then((response) => transformFromSingleIndexESResponse(response, searchResultType))
        .catch((error) => {
        log.error(`ES Search Error => ${error.stack}.`);
        if (throwError) {
            throw error;
        }
        return {
            total: 0,
            items: [],
        };
    });
}
exports.getSingleIndexResultsFromES = getSingleIndexResultsFromES;
function sortFilterIndexResult(items, total, limit) {
    const map = new Map();
    items.forEach((item) => {
        if (map.get(item.search_result_type)) {
            const existingList = map.get(item.search_result_type) || [];
            existingList.push(item);
        }
        else {
            const list = [item];
            map.set(item.search_result_type, list);
        }
    });
    const cloneItems = [];
    map.forEach((value, key) => {
        const summaryKeyName = key;
        const summaryLimit = enum_1.SearchResultWeight[summaryKeyName];
        const mapItems = value
            .sort((searchResultItem1, searchResultItem2) => {
            return searchResultItem1.score < searchResultItem2.score ? 1 : -1;
        })
            .splice(0, summaryLimit);
        cloneItems.push(...mapItems);
    });
    return {
        items: cloneItems.splice(0, limit),
        total,
    };
}
function transformFromMultiIndexESResponse(response, limit) {
    let total = 0;
    const items = [];
    if (response.data && response.data.responses) {
        const responsesFromAllIndices = response.data.responses;
        responsesFromAllIndices.forEach((singleIndexSearchResponse) => {
            total += singleIndexSearchResponse.hits.total;
            singleIndexSearchResponse.hits.hits.forEach((searchHITResponse) => {
                setSearchResultType(searchHITResponse);
                items.push(Object.assign(searchHITResponse._source, {
                    score: searchHITResponse._score,
                }));
            });
        });
    }
    return sortFilterIndexResult(items, total, limit);
}
exports.transformFromMultiIndexESResponse = transformFromMultiIndexESResponse;
async function getMultiIndexResultsFromES(esClient, esQuery, limit) {
    return esClient
        .post(`/_msearch`, `${esQuery}`)
        .then((response) => {
        return transformFromMultiIndexESResponse(response, limit);
    })
        .catch((error) => {
        log.error(`ES Search Error => ${error}.`);
        return {
            total: 0,
            items: [],
        };
    });
}
exports.getMultiIndexResultsFromES = getMultiIndexResultsFromES;
async function getDocumentByIDFromES(id, esIndex, esClient, dashFields) {
    return (esClient || axios_helper_1.ESDefaultClient)
        .get(`${esIndex}/_doc/${id}`)
        .then((response) => {
        var _a;
        const document = dashFields
            ? lodash_1.default.pick(response.data._source, dashFields)
            : response.data._source;
        if (!document.id) {
            document.id = response.data._id;
        }
        if (((_a = config_1.default.gae.logs.level) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === enum_1.LogLevel.DEBUG) {
            document.source = enum_1.ResultSource.ES;
            document.search_result_type = getSearchResultType(response.data);
            document.score = response.data._score || 0;
        }
        return document;
    })
        .catch((error) => {
        throw new http_404_error_1.default(`Document with id : ${id} is not found in ${esIndex} : ${error}`);
    });
}
exports.getDocumentByIDFromES = getDocumentByIDFromES;
function transformFromMultiDocumentESResponse(response, dashFields) {
    let total = 0;
    let items = [];
    if (response.data && response.data.docs) {
        const esResult = response.data.docs;
        if (esResult.length > 0) {
            total += esResult.length;
            items = esResult.map((hit) => {
                const document = dashFields
                    ? lodash_1.default.pick(hit._source, dashFields)
                    : hit._source;
                if (!document.id) {
                    document.id = hit._id;
                }
                document.source = enum_1.ResultSource.ES;
                document.search_result_type = getSearchResultType(hit);
                document.score = hit._score || 0;
                return document;
            });
        }
    }
    return { items, total };
}
exports.transformFromMultiDocumentESResponse = transformFromMultiDocumentESResponse;
async function getDocumentsByIDListFromES(idList, esIndex, dashFields, esClient) {
    return (esClient || axios_helper_1.ESDefaultClient)
        .post(`${esIndex}/_doc/_mget`, { ids: idList })
        .then((response) => transformFromMultiDocumentESResponse(response, dashFields))
        .catch((error) => {
        log.error(`ES Search Error => ${error.stack}.`);
        return {
            total: 0,
            items: [],
        };
    });
}
exports.getDocumentsByIDListFromES = getDocumentsByIDListFromES;
//# sourceMappingURL=elastic.service.js.map