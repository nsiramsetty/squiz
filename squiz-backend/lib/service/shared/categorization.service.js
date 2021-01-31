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
const esb = __importStar(require("elastic-builder"));
const lodash = __importStar(require("lodash"));
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
function filteringOptionsToESQueryArray(query) {
    const origins = query_parameter_parser_1.csvStringToArray(query === null || query === void 0 ? void 0 : query.content_filters).map((e) => e.trim().toLowerCase());
    const isScience = query_parameter_parser_1.booleanOrDefault(query === null || query === void 0 ? void 0 : query.is_science, false);
    const isReligion = query_parameter_parser_1.booleanOrDefault(query === null || query === void 0 ? void 0 : query.is_religion, false);
    const isSpirituality = query_parameter_parser_1.booleanOrDefault(query === null || query === void 0 ? void 0 : query.is_spirituality, false);
    const isSecular = query_parameter_parser_1.booleanOrDefault(query === null || query === void 0 ? void 0 : query.is_secular, false);
    const isNewage = query_parameter_parser_1.booleanOrDefault(query === null || query === void 0 ? void 0 : query.is_newage, false); // "new age" is considered one word
    const queries = new Array();
    if (isReligion) {
        queries.push(esb.termQuery('is_religion', isReligion));
    }
    if (isSpirituality) {
        queries.push(esb.termQuery('is_spirituality', isSpirituality));
    }
    if (isSecular) {
        queries.push(esb.termQuery('is_secular', isSecular));
    }
    if (isScience) {
        queries.push(esb.termQuery('is_science', isScience));
    }
    if (isNewage) {
        queries.push(esb.termQuery('is_newage', isNewage));
    }
    if (!lodash.isEmpty(origins)) {
        const categorizationQueries = [];
        if (origins.indexOf('newage') >= 0) {
            categorizationQueries.push(esb.termQuery('is_newage', true));
        }
        if (origins.indexOf('science') >= 0 || origins.indexOf('scientific') >= 0) {
            categorizationQueries.push(esb.termQuery('is_science', true));
        }
        if (origins.indexOf('secular') >= 0) {
            categorizationQueries.push(esb.termQuery('is_secular', true));
        }
        if (origins.indexOf('spirituality') >= 0 || origins.indexOf('spiritual') >= 0) {
            categorizationQueries.push(esb.termQuery('is_spirituality', true));
        }
        if (origins.indexOf('religion') >= 0 || origins.indexOf('religious') >= 0) {
            categorizationQueries.push(esb.termQuery('is_religion', true));
        }
        queries.push(esb.boolQuery().should(categorizationQueries).minimumShouldMatch(1));
    }
    return queries;
}
exports.default = filteringOptionsToESQueryArray;
//# sourceMappingURL=categorization.service.js.map