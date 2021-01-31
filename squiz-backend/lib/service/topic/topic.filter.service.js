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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTopics = exports.getTopicFilterResultsFromFS = exports.mergeTopicGroups = exports.combineRequestedLanguages = void 0;
const lodash = __importStar(require("lodash"));
const path_1 = __importDefault(require("path"));
const enum_1 = require("../../shared/enum");
const logger_1 = __importDefault(require("../../shared/logger"));
const firestore_service_1 = require("../shared/firestore.service");
const log = logger_1.default(path_1.default.relative(process.cwd(), __filename));
function combineRequestedLanguages(deviceLang, contentLang) {
    let requestedLang = [];
    if (deviceLang) {
        const supportedLangCodes = Object.values(enum_1.SupportedLanguage);
        const deviceLanguage = deviceLang;
        if (supportedLangCodes.indexOf(deviceLanguage) < 0) {
            requestedLang.push('en');
        }
        else {
            requestedLang.push(deviceLang);
        }
    }
    if (contentLang && contentLang.trim() !== '') {
        contentLang
            .split(',')
            .filter((l) => l.trim() !== '')
            .map((l) => l.trim())
            .forEach((l) => requestedLang.push(l));
    }
    requestedLang = lodash.uniq(requestedLang);
    if (requestedLang.length === 0) {
        requestedLang.push('en');
    }
    return requestedLang;
}
exports.combineRequestedLanguages = combineRequestedLanguages;
function processChildTags(topicTemp, tagGroups, tagGroupIndex, tagIndex) {
    const topic = topicTemp;
    if (topic.children && topic.children.length > 0) {
        for (let childIndex = 0; childIndex < topic.children.length; childIndex += 1) {
            const child = topic.children[childIndex];
            for (let otherTagGroupIndex = 1; otherTagGroupIndex < tagGroups.length; otherTagGroupIndex += 1) {
                const otherLevel1 = tagGroups[otherTagGroupIndex].topic_groups[tagGroupIndex];
                delete child.id;
                if (child.count_library_items <= 0) {
                    const otherChildren = otherLevel1.topics[tagIndex].children;
                    if (otherChildren &&
                        otherChildren.length > 0 &&
                        otherChildren[childIndex].topic === child.topic &&
                        otherChildren[childIndex].count_library_items > 0) {
                        child.count_library_items = otherChildren[childIndex].count_library_items;
                        break;
                    }
                }
            }
            topic.children = topic.children.filter((c) => c.count_library_items > 0);
        }
    }
}
function mergeTopicGroups(topicGroups, noChildren = false) {
    for (let index = 0; index < topicGroups.length; index += 1) {
        const result = topicGroups[index];
        for (let indexInTopicGroup = 0; indexInTopicGroup < result.topic_groups.length; indexInTopicGroup += 1) {
            const level1 = result.topic_groups[indexInTopicGroup];
            try {
                if (level1.topics) {
                    for (let topicIndex = 0; topicIndex < level1.topics.length; topicIndex += 1) {
                        const topic = level1.topics[topicIndex];
                        topic.id = `${topic.topic}-${result.id}`;
                        topic.children.map((childTopic) => {
                            const childTopicClone = childTopic;
                            childTopicClone.id = `${childTopicClone.topic}-${result.id}`;
                            return childTopicClone;
                        });
                        if (topic.count_library_items <= 0) {
                            for (let otherTopicGroupIndex = 1; otherTopicGroupIndex < topicGroups.length; otherTopicGroupIndex += 1) {
                                const otherLevel1 = topicGroups[otherTopicGroupIndex].topic_groups[indexInTopicGroup];
                                if (otherLevel1.topics.length > 0 &&
                                    otherLevel1.topics[topicIndex] &&
                                    otherLevel1.topics[topicIndex].topic === topic.topic) {
                                    if (otherLevel1.topics[topicIndex].count_library_items > 0) {
                                        topic.count_library_items = otherLevel1.topics[topicIndex].count_library_items;
                                        break;
                                    }
                                }
                            }
                        }
                        processChildTags(topic, topicGroups, indexInTopicGroup, topicIndex);
                    }
                    if (level1.topics.length > 0) {
                        level1.topics = level1.topics
                            .filter((t) => (t.children && t.children.length > 0) || t.count_library_items > 0)
                            .map((t) => {
                            const topic = t;
                            if (noChildren) {
                                delete topic.children;
                            }
                            return topic;
                        });
                    }
                }
            }
            catch (error) {
                log.error(`mergeTopicGroups :: error :${JSON.stringify(error)}`);
                throw error;
            }
        }
    }
}
exports.mergeTopicGroups = mergeTopicGroups;
async function getTopicFilterResultsFromFS(queryParams) {
    var _a, _b;
    const requestedLanguages = combineRequestedLanguages((_a = queryParams.device_lang) === null || _a === void 0 ? void 0 : _a.toString().trim(), (_b = queryParams.content_lang) === null || _b === void 0 ? void 0 : _b.toString().trim());
    const promises = [];
    const documentPath = `${enum_1.Collection.COMPANY_CONTENT_MAP}/${enum_1.Collection.TOPICS}/lang`;
    requestedLanguages.forEach((lang) => {
        promises.push(firestore_service_1.getFirestoreDocById(documentPath, lang));
    });
    const res = await Promise.all(promises).then((result) => {
        return result.length
            ? result
                .map((r) => {
                const data = r;
                if (data) {
                    data.id = r.id;
                }
                return data;
            })
                .filter((d) => !!d)
            : [];
    });
    mergeTopicGroups(res);
    return res;
}
exports.getTopicFilterResultsFromFS = getTopicFilterResultsFromFS;
async function filterTopics(queryParams) {
    const resultsFromES = await getTopicFilterResultsFromFS(queryParams);
    return { total: resultsFromES.length, items: resultsFromES };
}
exports.filterTopics = filterTopics;
//# sourceMappingURL=topic.filter.service.js.map