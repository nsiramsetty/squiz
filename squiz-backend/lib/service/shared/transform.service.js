"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const enum_1 = require("../../shared/enum");
function addMetaSummary(item, cloneItem) {
    if (cloneItem.search_result_type === enum_1.SearchResultType.USERS) {
        const userResponse = cloneItem;
        if (userResponse.is_friend) {
            Object.assign(item, { relation: { is_friend: true } });
            delete userResponse.is_friend;
        }
        if (userResponse.is_friend_of_friend || userResponse.mutual_friends) {
            Object.assign(item, { relation: { is_friend_of_friend: true, mutual_friends: userResponse.mutual_friends } });
            delete userResponse.is_friend_of_friend;
            delete userResponse.mutual_friends;
        }
        if (userResponse.is_following) {
            if (item.relation) {
                Object.assign(item.relation, { is_following: true });
            }
            else {
                Object.assign(item, { relation: { is_following: true } });
            }
            delete userResponse.is_following;
        }
        if (userResponse.friends_who_are_following) {
            if (item.relation) {
                Object.assign(item.relation, { friends_who_are_following: userResponse.friends_who_are_following });
            }
            else {
                Object.assign(item, { relation: { friends_who_are_following: userResponse.friends_who_are_following } });
            }
            delete userResponse.friends_who_are_following;
        }
    }
    if (cloneItem.search_result_type === enum_1.SearchResultType.GROUPS) {
        const groupResponse = cloneItem;
        if ('is_member' in cloneItem) {
            Object.assign(item, { relation: { is_member: groupResponse.is_member } });
            delete groupResponse.is_member;
        }
        if (groupResponse.friends) {
            if (item.relation) {
                Object.assign(item.relation, { friends: groupResponse.friends });
            }
            else {
                Object.assign(item, { relation: { friends: groupResponse.friends } });
            }
            delete groupResponse.friends;
        }
    }
}
function transformToUnifiedSearchResults(items) {
    const itemArray = [];
    items.forEach((key) => {
        var _a;
        const cloneKey = key;
        const keyName = cloneKey.search_result_type;
        const summaryKeyName = cloneKey.search_result_type;
        const unifiedItem = {
            type: keyName,
            [enum_1.SearchSummaryResultKeys[summaryKeyName]]: cloneKey,
        };
        const item = { item_summary: unifiedItem };
        addMetaSummary(item, cloneKey);
        // Removing Relations Temporarly
        // delete item.relation;
        itemArray.push(item);
        if (((_a = config_1.default.gae.logs.level) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== enum_1.LogLevel.DEBUG) {
            delete cloneKey.source;
            delete cloneKey.score;
            delete cloneKey.search_result_type;
        }
    });
    return itemArray;
}
exports.default = transformToUnifiedSearchResults;
//# sourceMappingURL=transform.service.js.map