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
Object.defineProperty(exports, "__esModule", { value: true });
exports.differenceGroups = exports.getGroupsResultsFromFS = exports.getGroupsResultsFromES = exports.getGroupESQuery = void 0;
const builder = __importStar(require("elastic-builder"));
const lodash = __importStar(require("lodash"));
const enum_1 = require("../../shared/enum");
// import logger from '../../shared/logger';
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
// const log = logger(path.relative(process.cwd(), __filename));
const MAX_LIMIT = 10000;
function comparer(arrayOne, arrayTwo) {
    return lodash.difference(arrayOne, arrayTwo);
}
function getGroupESQuery() {
    const queries = [];
    const reqBody = builder.requestBodySearch().from(0).size(MAX_LIMIT).source(['id']);
    queries.push(builder.boolQuery().mustNot(builder.matchQuery('type.keyword', enum_1.GroupType.LEGACY)));
    queries.push(builder
        .boolQuery()
        .should([
        builder.matchQuery('type.keyword', enum_1.GroupType.GROUP),
        builder.matchQuery('type.keyword', enum_1.GroupType.ENTERPRISE),
    ])
        .minimumShouldMatch(1));
    return reqBody.query(builder.boolQuery().must(queries));
}
exports.getGroupESQuery = getGroupESQuery;
async function getGroupsResultsFromES() {
    const esQuery = getGroupESQuery();
    return elastic_service_1.getSingleIndexResultsFromES(enum_1.ESIndex.GROUP, esQuery);
}
exports.getGroupsResultsFromES = getGroupsResultsFromES;
async function getGroupsResultsFromFS() {
    const conditionsForSearch = [];
    conditionsForSearch.push({
        fieldPath: 'type',
        opStr: enum_1.FSWhereOperator.IN,
        value: [enum_1.GroupType.ENTERPRISE, enum_1.GroupType.GROUP],
    });
    const fieldMasks = ['id'];
    const conditionsForSort = [];
    const offset = 0;
    const limit = MAX_LIMIT;
    return firestore_service_1.getFirestoreDocuments(enum_1.Collection.EVENTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}
exports.getGroupsResultsFromFS = getGroupsResultsFromFS;
async function differenceGroups() {
    const resultsFromES = await getGroupsResultsFromES();
    const esGroups = resultsFromES.items.map((e) => e.id);
    const resultsFromFS = await getGroupsResultsFromFS();
    const fsGroups = resultsFromFS.items.map((e) => e.id);
    const firestoreGroupsDiff = comparer(fsGroups, esGroups);
    const elasticGroupsDiff = comparer(esGroups, fsGroups);
    const groupDifference = {
        elasticOnlyGroups: elasticGroupsDiff,
        firestoreOnlyGroups: firestoreGroupsDiff,
        totalElasticOnlyGroups: esGroups.length,
        totalFirestoreGroups: fsGroups.length,
        totalElasticGroups: elasticGroupsDiff.length,
        totalFirestoreOnlyGroups: firestoreGroupsDiff.length,
    };
    return groupDifference;
}
exports.differenceGroups = differenceGroups;
//# sourceMappingURL=group.difference.service.js.map