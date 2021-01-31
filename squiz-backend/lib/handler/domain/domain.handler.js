"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainMemberHandler = exports.domainGetByIDHandler = exports.domainFilterHandler = exports.domainSearchHandler = void 0;
const domain_filter_service_1 = __importDefault(require("../../service/domain/domain.filter.service"));
const domain_get_service_1 = __importDefault(require("../../service/domain/domain.get.service"));
const domain_member_service_1 = __importDefault(require("../../service/domain/domain.member.service"));
const domain_search_service_1 = __importDefault(require("../../service/domain/domain.search.service"));
const http_client_error_1 = __importDefault(require("../../shared/http/http-client-error"));
async function domainSearchHandler(cxt) {
    try {
        return await domain_search_service_1.default(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.domainSearchHandler = domainSearchHandler;
async function domainFilterHandler(cxt) {
    try {
        return await domain_filter_service_1.default(cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.domainFilterHandler = domainFilterHandler;
async function domainGetByIDHandler(cxt) {
    try {
        return await domain_get_service_1.default(cxt.getUrlParam('id'));
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.domainGetByIDHandler = domainGetByIDHandler;
async function domainMemberHandler(cxt) {
    try {
        const domainId = cxt.getUrlParam('id');
        return await domain_member_service_1.default(domainId, cxt.getRequestParams());
    }
    catch (error) {
        const message = error.message || `Failed to fetch data from Firestore and Elastic Search.`;
        throw new http_client_error_1.default(`${message}`, error.statusCode, error.stack);
    }
}
exports.domainMemberHandler = domainMemberHandler;
//# sourceMappingURL=domain.handler.js.map