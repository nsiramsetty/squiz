"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import path from 'path';
const axios_helper_1 = require("../../helper/axios.helper");
const event_model_1 = require("../../model/event/event.model");
const enum_1 = require("../../shared/enum");
// import logger from '../../shared/logger';
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
// const log = logger(path.relative(process.cwd(), __filename));
async function getEvent(id) {
    return elastic_service_1.getDocumentByIDFromES(id, enum_1.ESIndex.EVENT, axios_helper_1.ESDefaultClient, event_model_1.EVENT_SUMMARY_FIELDS).catch(async () => {
        return firestore_service_1.getFirestoreDocById(enum_1.Collection.EVENTS, id, event_model_1.EVENT_SUMMARY_FIELDS);
    });
}
exports.default = getEvent;
//# sourceMappingURL=event.get.service.js.map