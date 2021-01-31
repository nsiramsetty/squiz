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
exports.validateAndReplaceWithEnglish = exports.getCombinedLanguages = void 0;
const _ = __importStar(require("lodash"));
const enum_1 = require("../../shared/enum");
function getCombinedLanguages(deviceLang, contentLangs) {
    let combinedLanguages = [];
    if (contentLangs && contentLangs.trim() !== '') {
        contentLangs
            .split(',')
            .filter((l) => l.trim() !== '')
            .map((l) => l.trim())
            .forEach((l) => combinedLanguages.push(l));
    }
    if (deviceLang && combinedLanguages.length === 0) {
        if (combinedLanguages.indexOf(deviceLang) === -1) {
            combinedLanguages.push(deviceLang);
        }
    }
    combinedLanguages = _.uniq(combinedLanguages);
    return combinedLanguages;
}
exports.getCombinedLanguages = getCombinedLanguages;
function validateAndReplaceWithEnglish(requestedLangs, supportedLangs) {
    if (!requestedLangs || (Array.isArray(requestedLangs) && requestedLangs.length === 0)) {
        return ['en'];
    }
    let supportedLangCodes;
    if (supportedLangs && Array.isArray(supportedLangs) && supportedLangs.length > 0) {
        supportedLangCodes = supportedLangs;
    }
    else {
        supportedLangCodes = Object.values(enum_1.SupportedLanguage);
    }
    const result = requestedLangs.map((l) => {
        if (supportedLangCodes.indexOf(l) < 0) {
            return 'en';
        }
        return l;
    });
    return _.uniq(result);
}
exports.validateAndReplaceWithEnglish = validateAndReplaceWithEnglish;
//# sourceMappingURL=i18n.service.js.map