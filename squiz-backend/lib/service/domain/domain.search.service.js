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
exports.getDomainSearchResultsFromES = exports.getESQueryForDomainsRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
// import path from 'path';
// import logger from '../../../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));
function getESQueryForDomainsRegularSearch(keyword, offset, limit) {
    const scoreFunctions = [
        builder.fieldValueFactorFunction('number_of_members').factor(0.02).modifier('sqrt').missing(0),
    ];
    const mainQuery = builder.boolQuery().must(builder.matchQuery('name.keyword', keyword).fuzziness(2));
    return builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
        .source(['id', 'name'])
        .from(offset)
        .size(limit)
        .sort(builder.sort('number_of_members', 'desc'));
}
exports.getESQueryForDomainsRegularSearch = getESQueryForDomainsRegularSearch;
async function getDomainSearchResultsFromES(keyword, offset, limit) {
    const esQuery = getESQueryForDomainsRegularSearch(keyword, offset, limit);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.EMAIL_DOMAIN, esQuery);
}
exports.getDomainSearchResultsFromES = getDomainSearchResultsFromES;
async function searchDomains(queryParams) {
    var _a;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`searchDomains :: Parameter => keyword :: is Required`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const resultsFromES = await getDomainSearchResultsFromES(keyword, offset, limit);
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.default = searchDomains;
//# sourceMappingURL=domain.search.service.js.map