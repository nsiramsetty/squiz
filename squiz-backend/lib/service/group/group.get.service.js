"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import path from 'path';
const axios_helper_1 = require("../../helper/axios.helper");
const enum_1 = require("../../shared/enum");
// import logger from '../../shared/logger';
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
// const log = logger(path.relative(process.cwd(), __filename));
async function getGroup(id) {
    return elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.GROUP, axios_helper_1.ESDefaultClient).catch(async () => {
        return firestore_service_1.getFirestoreDocById(enum_1.Collection.GROUPS, id);
    });
}
exports.default = getGroup;
//# sourceMappingURL=group.get.service.js.map