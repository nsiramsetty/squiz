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
exports.interceptEventQueryParams = exports.csvStringToArray = exports.floatOrDefault = exports.numberOrDefault = exports.checkIsDecimal = exports.checkIsNumber = exports.booleanOrDefault = void 0;
const lodash = __importStar(require("lodash"));
const timestamp_service_1 = require("./timestamp.service");
function booleanOrDefault(value, defaultValue) {
    if (value === undefined || value === null) {
        return defaultValue;
    }
    return lodash.isString(value) && value.trim().toLowerCase() === 'true' ? true : defaultValue;
}
exports.booleanOrDefault = booleanOrDefault;
function checkIsNumber(value) {
    try {
        const regEx = /^\d+$/;
        return regEx.test(value);
    }
    catch (error) {
        return false;
    }
}
exports.checkIsNumber = checkIsNumber;
function checkIsDecimal(value) {
    try {
        const regEx = /^\d*\.{0,1}\d+$/;
        return regEx.test(value);
    }
    catch (error) {
        return false;
    }
}
exports.checkIsDecimal = checkIsDecimal;
function numberOrDefault(value, defaultValue = 0) {
    if (!value || !checkIsNumber(value.toString().trim())) {
        return defaultValue;
    }
    try {
        return +value;
    }
    catch (error) {
        return defaultValue;
    }
}
exports.numberOrDefault = numberOrDefault;
function floatOrDefault(value, defaultValue = 0) {
    if (!value) {
        return defaultValue;
    }
    try {
        return parseFloat(value);
    }
    catch (error) {
        return defaultValue;
    }
}
exports.floatOrDefault = floatOrDefault;
function csvStringToArray(value) {
    const arrayParam = [];
    if (!lodash.isEmpty(value) && typeof value === 'string') {
        value
            .split(',')
            .filter((l) => l.trim() !== '')
            .map((l) => l.trim())
            .forEach((l) => arrayParam.push(l));
    }
    return lodash.uniq(arrayParam);
}
exports.csvStringToArray = csvStringToArray;
function interceptEventQueryParams(req, keyName) {
    if (req.query[keyName]) {
        const formattedDateTime = timestamp_service_1.convertUnixTimeStampToDate(+req.query[keyName].toString());
        const newTime = timestamp_service_1.convertDateToUnixTimeStamp(formattedDateTime);
        if (newTime.toString() !== '') {
            req.query[keyName] = newTime.toString();
            const originUrlArr = req.originalUrl.split('?');
            const headerArr = originUrlArr.length > 1 ? originUrlArr[1].split('&') : [];
            if (headerArr.length) {
                const filteredHeaderArr = headerArr.filter((val) => {
                    return !val.includes(keyName);
                });
                filteredHeaderArr.push(`${keyName}=${newTime}`);
                req.originalUrl = `${originUrlArr[0]}?${filteredHeaderArr.join('&')}`;
            }
        }
    }
}
exports.interceptEventQueryParams = interceptEventQueryParams;
//# sourceMappingURL=query-parameter-parser.js.map