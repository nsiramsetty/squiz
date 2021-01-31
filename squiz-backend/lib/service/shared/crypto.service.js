"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function encodeStringToMD5(data) {
    return crypto_1.default.createHash('md5').update(data).digest('hex');
}
exports.default = encodeStringToMD5;
//# sourceMappingURL=crypto.service.js.map