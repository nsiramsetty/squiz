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
exports.getDomainFilterResultsFromES = exports.getESQueryForUserRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const user_model_1 = require("../../model/user/user.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const crypto_service_1 = __importDefault(require("../shared/crypto.service"));
const elastic_service_1 = require("../shared/elastic.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
// import path from 'path';
// import logger from '../../../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));
function getESQueryForUserRegularSearch(id, queryParams) {
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const scoreFunctions = [
        builder.fieldValueFactorFunction('number_of_members').factor(0.02).modifier('sqrt').missing(0),
    ];
    const mainQuery = builder.boolQuery().must(builder.matchQuery('email_domains', id));
    const reqBody = builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
        .source(['id', 'email_domains'])
        .from(offset)
        .size(limit);
    return reqBody;
}
exports.getESQueryForUserRegularSearch = getESQueryForUserRegularSearch;
async function getDomainFilterResultsFromES(id, queryParams) {
    const esQuery = getESQueryForUserRegularSearch(id, queryParams);
    const result = await elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.USER_RELATION, esQuery);
    const userIds = result.items.map((e) => e.id);
    return elastic_service_1.getDocumentsByIDListFromES(userIds, enum_1.ESIndex.USER, user_model_1.USER_SUMMARY_FIELDS);
}
exports.getDomainFilterResultsFromES = getDomainFilterResultsFromES;
async function domainMembers(domainId, queryParams) {
    const encodedId = crypto_service_1.default(domainId);
    const resultsFromES = await getDomainFilterResultsFromES(encodedId, queryParams);
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.default = domainMembers;
//# sourceMappingURL=domain.member.service.js.map