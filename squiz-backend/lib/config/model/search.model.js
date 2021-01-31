"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const preprod_config_1 = __importDefault(require("../environments/preprod.config"));
const production_config_1 = __importDefault(require("../environments/production.config"));
class AppConfig {
    constructor() {
        switch (process.env.GOOGLE_CLOUD_PROJECT) {
            case 'insight-timer-a1ac7':
                Object.assign(this, production_config_1.default);
                break;
            case 'insight-timer-preprod':
                Object.assign(this, preprod_config_1.default);
                break;
            default:
                Object.assign(this, preprod_config_1.default);
                break;
        }
    }
    getFirestoreServiceBaseURL() {
        return this.firestoreServiceBaseURL;
    }
}
exports.AppConfig = AppConfig;
//# sourceMappingURL=search.model.js.map