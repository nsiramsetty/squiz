"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const search_model_1 = require("./model/search.model");
// Set .env file as mandatory
const envFound = dotenv_1.default.config();
if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
// Export the Configuration along with default values where mandatory
const environmentVariablesList = ['GAE_API_PREFIX', 'GAE_APP_NAME', 'GAE_LOGS_LEVEL', 'GAE_APP_SLACK_URL'];
environmentVariablesList.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`⚠️  Couldn't find environment variable ${variable}, Please make sure that it is listed in .env  ⚠️`);
    }
});
process.env.GCLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
exports.default = {
    gae: {
        api: {
            prefix: process.env.GAE_API_PREFIX || '/api/v1',
        },
        app: {
            name: process.env.GAE_APP_NAME,
            slackURL: process.env.GAE_APP_SLACK_URL || '',
        },
        logs: {
            level: process.env.GAE_LOGS_LEVEL,
        },
    },
    search: new search_model_1.AppConfig(),
};
//# sourceMappingURL=index.js.map