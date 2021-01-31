"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_helper_1 = require("../../helper/axios.helper");
const domain_model_1 = require("../../model/domain/domain.model");
const enum_1 = require("../../shared/enum");
const crypto_service_1 = __importDefault(require("../shared/crypto.service"));
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
async function getDomain(id) {
    let domainName = crypto_service_1.default(id);
    return elastic_service_1.getDocumentByIDFromES(domainName, enum_1.ESIndex.EMAIL_DOMAIN, axios_helper_1.ESDefaultClient, domain_model_1.DOMAIN_SUMMARY).catch(async () => {
        domainName = id.replace(/\./g, '__');
        return firestore_service_1.getFirestoreDocById(enum_1.Collection.EMAIL_DOMAIN, domainName, domain_model_1.DOMAIN_SUMMARY);
    });
}
exports.default = getDomain;
//# sourceMappingURL=domain.get.service.js.map