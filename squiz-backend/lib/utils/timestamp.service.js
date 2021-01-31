"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateToUnixTimeStamp = exports.convertUnixTimeStampToDate = void 0;
const moment_1 = __importDefault(require("moment"));
function convertUnixTimeStampToDate(timestamp) {
    const dateTimeString = new Date(timestamp);
    return moment_1.default(dateTimeString).format('YYYY-MM-DD HH:mm');
}
exports.convertUnixTimeStampToDate = convertUnixTimeStampToDate;
function convertDateToUnixTimeStamp(date) {
    return moment_1.default(date, 'YYYY-MM-DD HH:mm').valueOf();
}
exports.convertDateToUnixTimeStamp = convertDateToUnixTimeStamp;
//# sourceMappingURL=timestamp.service.js.map