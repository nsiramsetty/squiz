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
exports.searchTopViewV2 = exports.searchTopView = exports.getTopViewSearchResultsFromESV2 = exports.getTopViewSearchResultsFromES = exports.getTopViewSearchResultsFromFS = exports.getCommonESQueryForTopSearch = void 0;
const builder = __importStar(require("elastic-builder"));
const lodash = __importStar(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const axios_helper_1 = require("../../helper/axios.helper");
const event_model_1 = require("../../model/event/event.model");
const group_model_1 = require("../../model/group/group.model");
const hashtag_model_1 = require("../../model/hashtag/hashtag.model");
const library_item_model_1 = require("../../model/library-item/library-item.model");
const playlist_model_1 = require("../../model/playlist/playlist.model");
const user_model_1 = require("../../model/user/user.model");
const constants_1 = require("../../shared/constants");
const enum_1 = require("../../shared/enum");
const http_400_error_1 = __importDefault(require("../../shared/http/http-400-error"));
// import logger from '../../shared/logger';
const query_parameter_parser_1 = require("../../utils/query-parameter-parser");
const event_search_service_1 = require("../event/event.search.service");
const group_search_service_1 = require("../group/group.search.service");
const hashtag_search_service_1 = require("../hashtag/hashtag.search.service");
const audio_search_service_1 = require("../library-item/audio.search.service");
const playlist_search_service_1 = require("../playlist/playlist.search.service");
const elastic_service_1 = require("../shared/elastic.service");
const firestore_service_1 = require("../shared/firestore.service");
const i18n_service_1 = require("../shared/i18n.service");
const transform_service_1 = __importDefault(require("../shared/transform.service"));
const user_search_service_1 = require("../user/user/user.search.service");
// const log = logger(path.relative(process.cwd(), __filename));
function getCommonESQueryForTopSearch(queryParams) {
    var _a, _b;
    const fields = [
        'title^4',
        'learn_description',
        'content_type',
        'publisher.name^2',
        // 'long_description',
        // 'short_description',
        'description',
        'hashtags',
        'owner.name^2',
        'region.name',
        'name^3',
        'topic',
    ];
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    const deviceLang = i18n_service_1.validateAndReplaceWithEnglish([(_b = queryParams.device_lang) === null || _b === void 0 ? void 0 : _b.toString().trim()])[0];
    const excludePublishers = query_parameter_parser_1.booleanOrDefault(queryParams.exclude_publishers, false);
    const epoch = moment_1.default.utc().add(moment_1.default.duration(0, 'minutes')).valueOf();
    const scoreFunctions = [
        builder
            .weightScoreFunction()
            .filter(builder.termQuery('lang.iso_639_1', deviceLang))
            .weight(deviceLang === enum_1.SupportedLanguage.ENGLISH ? 20 : 30),
        builder.weightScoreFunction().filter(builder.termQuery('title.keyword', keyword.toLowerCase())).weight(50),
        builder.weightScoreFunction().filter(builder.termQuery('name.keyword', keyword.toLowerCase())).weight(50),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(0).type('most_fields'))
            .weight(100),
        builder
            .weightScoreFunction()
            .filter(builder.multiMatchQuery(fields, keyword).fuzziness(1).type('best_fields'))
            .weight(50),
        builder
            .weightScoreFunction()
            .filter(builder.boolQuery().mustNot(builder.existsQuery('avatar')))
            .weight(-5),
        builder
            .weightScoreFunction()
            .filter(builder.rangeQuery('_next_occurrences.start_date.epoch').lt(epoch))
            .weight(-500),
        builder.fieldValueFactorFunction('member_count').factor(0.0009).modifier('sqrt').missing(0),
    ];
    const mainQuery = builder.boolQuery().must(builder.multiMatchQuery(fields, keyword).fuzziness(2).type('most_fields'));
    if (excludePublishers) {
        mainQuery.filter(builder.termQuery('is_publisher', false));
    }
    return builder
        .requestBodySearch()
        .query(builder.functionScoreQuery().query(mainQuery).scoreMode('sum').functions(scoreFunctions).boostMode('sum'))
        .from(offset)
        .size(limit);
}
exports.getCommonESQueryForTopSearch = getCommonESQueryForTopSearch;
async function getTopViewSearchResultsFromFS(keyword, offset, limit) {
    return firestore_service_1.mergeMultipleTransformFromFSResponse([
        await audio_search_service_1.getAudioSearchResultsFromFS(keyword, offset, limit),
        await playlist_search_service_1.getPlaylistSearchResultsFromFS(keyword, offset, limit),
        await group_search_service_1.getGroupSearchResultsFromFS(keyword, offset, limit),
        await hashtag_search_service_1.getHashtagSearchResultsFromFS(keyword, offset, limit),
        await user_search_service_1.getUserSearchResultsFromFS(keyword, offset, limit),
        await event_search_service_1.getEventSearchResultsFromFS(keyword, offset, limit),
    ], limit);
}
exports.getTopViewSearchResultsFromFS = getTopViewSearchResultsFromFS;
async function getTopViewSearchResultsFromES(keyword, offset, limit, deviceLang, excludePublishers = false, userID, singleTrackOnly = false, queryParams) {
    const esQuery = 
    // `{"index" : "${ESIndex.LIBRARY_ITEM}"}\n${JSON.stringify(
    //   courseQueryForTopView(deviceLang, keyword, offset, limit),
    // )}\n` +
    // `{"index" : "${ESIndex.LIBRARY_ITEM}"}\n${JSON.stringify(
    //   libraryItemQueryForTopView(deviceLang, keyword, offset, limit, queryParams),
    // )}\n` +
    `{"index" : "${enum_1.ESIndex.LIBRARY_ITEM}"}\n${JSON.stringify(audio_search_service_1.getESQueryForAudioTopViewSearch(keyword, offset, limit, deviceLang, singleTrackOnly, queryParams))}\n` +
        `{"index" : "${enum_1.ESIndex.PLAYLIST}"}\n${JSON.stringify(playlist_search_service_1.getESQueryForPlaylistTopViewSearch(keyword, offset, limit, deviceLang))}\n` +
        `{"index" : "${enum_1.ESIndex.EVENT}"}\n${JSON.stringify(event_search_service_1.getESQueryFoEventsTopViewSearch(keyword, offset, limit))}\n` +
        `{"index" : "${enum_1.ESIndex.USER}"}\n${JSON.stringify(user_search_service_1.getESQueryForUsersTopViewSearch(keyword, offset, limit, excludePublishers, userID))}\n` +
        `{"index" : "${enum_1.ESIndex.HASHTAG}"}\n${JSON.stringify(hashtag_search_service_1.getESQueryForHashtagsTopViewSearch(keyword, offset, limit, deviceLang))}\n` +
        `{"index" : "${enum_1.ESIndex.GROUP}"}\n${JSON.stringify(group_search_service_1.getESQueryForGroupsTopViewSearch(keyword, offset, limit, deviceLang))}\n`;
    return elastic_service_1.getMultiIndexResultsFromES(axios_helper_1.ESDefaultClient, esQuery, limit);
}
exports.getTopViewSearchResultsFromES = getTopViewSearchResultsFromES;
async function getTopViewSearchResultsFromESV2(queryParams) {
    var _a;
    const esQuery = getCommonESQueryForTopSearch(queryParams);
    const indexName = `${enum_1.ESIndex.EVENT},${enum_1.ESIndex.LIBRARY_ITEM},${enum_1.ESIndex.PLAYLIST},${enum_1.ESIndex.USER},${enum_1.ESIndex.HASHTAG},${enum_1.ESIndex.GROUP}`;
    const response = await elastic_service_1.getSingleIndexResultsFromES(indexName, esQuery);
    const filteredRecords = [];
    const userID = (_a = queryParams.user_id) === null || _a === void 0 ? void 0 : _a.toString();
    let friends = [];
    let mutualFriends = new Map();
    if (userID) {
        friends = (await user_search_service_1.getFriends(userID)).friends;
        const relations = await user_search_service_1.getRelationsList(userID, friends);
        friends = relations.friends;
        mutualFriends = relations.mutualFriendList;
    }
    response.items.forEach((item) => {
        if (item.search_result_type === enum_1.SearchResultType.EVENTS) {
            filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, event_model_1.EVENT_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
        }
        else if (item.search_result_type === enum_1.SearchResultType.LIBRARY_ITEMS) {
            if (item.item_type === enum_1.ItemType.COURSES) {
                filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, library_item_model_1.COURSE_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
            }
            else if (item.item_type === enum_1.ItemType.DAILY_INSIGHT) {
                filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, library_item_model_1.DAILY_INSIGHT_ITEM_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
            }
            else {
                filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, library_item_model_1.SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
            }
        }
        else if (item.search_result_type === enum_1.SearchResultType.PLAYLISTS) {
            filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, playlist_model_1.PLAYLIST_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
        }
        else if (item.search_result_type === enum_1.SearchResultType.USERS) {
            if (userID && userID !== item.id) {
                if (friends.indexOf(item.id) > -1) {
                    Object.assign(item, { is_friend: true });
                }
                if (mutualFriends.get(item.id)) {
                    Object.assign(item, { is_friend_of_friend: true });
                    Object.assign(item, { mutual_friends: mutualFriends.get(item.id) });
                }
                filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, user_model_1.USER_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
            }
            else {
                filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, user_model_1.USER_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
            }
        }
        else if (item.search_result_type === enum_1.SearchResultType.HASHTAGS) {
            filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, hashtag_model_1.HASHTAG_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
        }
        else if (item.search_result_type === enum_1.SearchResultType.GROUPS) {
            filteredRecords.push(Object.assign(Object.assign({}, lodash.pick(item, group_model_1.GROUP_SUMMARY_TOP_VIEW_FIELDS)), { search_result_type: item.search_result_type }));
        }
    });
    return { total: response.total, items: filteredRecords };
}
exports.getTopViewSearchResultsFromESV2 = getTopViewSearchResultsFromESV2;
async function searchTopView(queryParams) {
    var _a, _b, _c;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`SearchTopView :: query :: is Required for Top View Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const userID = (_b = queryParams.user_id) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const deviceLang = i18n_service_1.validateAndReplaceWithEnglish([(_c = queryParams.device_lang) === null || _c === void 0 ? void 0 : _c.toString().trim()])[0];
    const excludePublishers = query_parameter_parser_1.booleanOrDefault(queryParams.exclude_publishers, false);
    const singleTrackOnly = query_parameter_parser_1.booleanOrDefault(queryParams.single_tracks_only, false);
    return getTopViewSearchResultsFromES(keyword, offset, limit, deviceLang, excludePublishers, userID, singleTrackOnly, queryParams).then(async (response) => {
        let items = [];
        if (userID && response.items[0] && response.items[0].id === userID) {
            items.push(response.items[0]);
            response.items.shift();
        }
        if (response.total === 0) {
            const resultsFromFS = await getTopViewSearchResultsFromFS(keyword, offset, limit);
            return { total: resultsFromFS.total, items: transform_service_1.default(resultsFromFS.items) };
        }
        items = lodash.uniqBy(items, 'id');
        return { total: response.total, items: transform_service_1.default(response.items) };
    });
}
exports.searchTopView = searchTopView;
async function searchTopViewV2(queryParams) {
    var _a;
    const keyword = (_a = queryParams.query) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!keyword) {
        throw new http_400_error_1.default(`SearchTopViewV2 :: query :: is Required for Top View Search.`);
    }
    const offset = query_parameter_parser_1.numberOrDefault(queryParams.offset || queryParams.from, 0);
    const limit = query_parameter_parser_1.numberOrDefault(queryParams.limit || queryParams.size, constants_1.DEFAULT_PAGE_SIZE);
    const resultsFromES = await getTopViewSearchResultsFromESV2(queryParams);
    if (resultsFromES.total === 0) {
        const resultsFromFS = await getTopViewSearchResultsFromFS(keyword, offset, limit);
        return { total: resultsFromFS.total, items: transform_service_1.default(resultsFromFS.items) };
    }
    return { total: resultsFromES.total, items: transform_service_1.default(resultsFromES.items) };
}
exports.searchTopViewV2 = searchTopViewV2;
//# sourceMappingURL=top-view.service.js.map