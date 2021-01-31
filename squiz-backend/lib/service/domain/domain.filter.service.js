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
exports.getDomainFilterResultsFromES = exports.getESQueryForDomainsRegularSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const elastic_service_1 = require("../shared/elastic.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
// import path from 'path';
// import logger from '../../../shared/logger';
// const log = logger(path.relative(process.cwd(), __filename));
function getESQueryForDomainsRegularSearch(queryParams) {
    var _a, _b, _c;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const sort_option = (_b = queryParams.sort_option) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const sort_direction = (_c = queryParams.sort_direction) === null || _c === void 0 ? void 0 : _c.toString().trim();
    const mainQuery = builder.boolQuery().must(keyword ? builder.termQuery('name', keyword) : builder.matchAllQuery());
    const reqBody = builder
        .requestBodySearch()
        .query(mainQuery)
        .source(['id', 'name'])
        .from(offset)
        .size(limit);
    if (!keyword && sort_option) {
        switch (sort_option.toLowerCase()) {
            case 'most_members':
                reqBody.sort(builder.sort('number_of_members', sort_direction || 'desc'));
                break;
            default:
                break;
        }
    }
    return reqBody;
}
exports.getESQueryForDomainsRegularSearch = getESQueryForDomainsRegularSearch;
async function getDomainFilterResultsFromES(queryParams) {
    const esQuery = getESQueryForDomainsRegularSearch(queryParams);
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.EMAIL_DOMAIN, esQuery);
}
exports.getDomainFilterResultsFromES = getDomainFilterResultsFromES;
async function filterDomains(queryParams) {
    const resultsFromES = await getDomainFilterResultsFromES(queryParams);
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.default = filterDomains;
//# sourceMappingURL=domain.filter.service.js.map