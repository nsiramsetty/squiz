"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupType = exports.EventType = exports.EventPrivacy = exports.EventStatus = exports.ResultSource = exports.LogLevel = exports.ESIndexName = exports.FSWhereOperator = exports.DailyInsightType = exports.Environment = exports.SupportedLanguage = exports.ItemType = exports.Collection = exports.ESIndex = exports.SearchSummaryResultKeys = exports.SearchResultWeight = exports.SearchResultType = void 0;
var SearchResultType;
(function (SearchResultType) {
    SearchResultType["GROUPS"] = "GROUPS";
    SearchResultType["HASHTAGS"] = "HASHTAGS";
    SearchResultType["LIBRARY_ITEMS"] = "LIBRARY_ITEMS";
    SearchResultType["USERS"] = "USERS";
    SearchResultType["PUBLISHERS"] = "PUBLISHERS";
    SearchResultType["PLAYLISTS"] = "PLAYLISTS";
    SearchResultType["EVENTS"] = "EVENTS";
    SearchResultType["GRATITUDE_WALL_POSTS"] = "GRATITUDE_WALL_POSTS";
    SearchResultType["COURSE_DAYS"] = "COURSE_DAYS";
    SearchResultType["LIBRARY_ITEM_REVIEWS"] = "LIBRARY_ITEM_REVIEWS";
    SearchResultType["USER_RELATION"] = "USER_RELATION";
    SearchResultType["TOPICS"] = "TOPICS";
    SearchResultType["UNKNOWN"] = "UNKNOWN";
    SearchResultType["ACTIVITY"] = "ACTIVITIES";
    SearchResultType["EMAIL_DOMAINS"] = "EMAIL_DOMAINS";
})(SearchResultType = exports.SearchResultType || (exports.SearchResultType = {}));
exports.SearchResultWeight = {
    GROUPS: 3,
    HASHTAGS: 3,
    LIBRARY_ITEMS: 3,
    SINGLE_TRACKS: 3,
    DAILY_INSIGHTS: 3,
    COURSES: 3,
    USERS: 3,
    PUBLISHERS: 3,
    PLAYLISTS: 3,
    EVENTS: 3,
    GRATITUDE_WALL_POSTS: 3,
    COURSE_DAYS: 3,
    LIBRARY_ITEM_REVIEWS: 3,
    USER_RELATION: 3,
    TOPICS: 3,
    UNKNOWN: 3,
    ACTIVITIES: 3,
    EMAIL_DOMAINS: 0,
};
exports.SearchSummaryResultKeys = {
    GROUPS: 'group_summary',
    HASHTAGS: 'hashtag_summary',
    LIBRARY_ITEMS: 'library_item_summary',
    PEOPLE: 'user_summary',
    USERS: 'user_summary',
    PUBLISHERS: 'publisher_summary',
    PLAYLISTS: 'playlist_summary',
    EVENTS: 'event_summary',
    ACTIVITIES: 'activity_summary',
    TOPICS: 'topic_summary',
    UNKNOWN: 'unknown_summary',
    GRATITUDE_WALL_POSTS: 'gratitude_wall_summary',
    COURSE_DAYS: 'course_days_summary',
    LIBRARY_ITEM_REVIEWS: 'library_item_review_summary',
    USER_RELATION: 'user_relation_summary',
    EMAIL_DOMAINS: 'email_domain_summary',
};
var ESIndex;
(function (ESIndex) {
    ESIndex["LIBRARY_ITEM"] = "alias_libraryitems";
    ESIndex["USER"] = "alias_users";
    ESIndex["HASHTAG"] = "alias_hashtags";
    ESIndex["GROUP"] = "alias_groups";
    ESIndex["PLAYLIST"] = "alias_playlists";
    ESIndex["USER_RELATION"] = "alias_user_relations";
    ESIndex["COURSE"] = "alias_courses";
    ESIndex["MEDITATOR"] = "alias_meditators";
    ESIndex["ACTIVITY"] = "alias_activities";
    ESIndex["EVENT"] = "alias_events";
    ESIndex["EMAIL_DOMAIN"] = "alias_email_domains";
})(ESIndex = exports.ESIndex || (exports.ESIndex = {}));
var Collection;
(function (Collection) {
    Collection["COURSES"] = "courses";
    Collection["GROUPS"] = "groups";
    Collection["USERS"] = "users";
    Collection["HASHTAGS"] = "hashtags";
    Collection["LIBRARY_ITEMS"] = "libraryitems";
    Collection["PLAYLISTS"] = "playlists";
    Collection["EVENTS"] = "events";
    Collection["TOPICS"] = "topics";
    Collection["COMPANY_CONTENT_MAP"] = "company_content_map";
    Collection["LIBRARY_PAGES"] = "library_pages";
    Collection["BEGINNER_KITS"] = "beginner_kits";
    Collection["ADMIN"] = "admin";
    Collection["INFLUENCERS"] = "influencers";
    Collection["WEB_SESSIONS"] = "web_sessions";
    Collection["CURATED_LIBRARY_ITEMS"] = "curated_library_items";
    Collection["CURATED_COURSES"] = "curated_courses";
    Collection["TEAMS"] = "teams";
    Collection["EMAIL_DOMAIN"] = "email_domains";
})(Collection = exports.Collection || (exports.Collection = {}));
var ItemType;
(function (ItemType) {
    ItemType["SINGLE_TRACKS"] = "SINGLE_TRACKS";
    ItemType["COURSES"] = "COURSES";
    ItemType["DAILY_INSIGHT"] = "DAILY_INSIGHT";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
var SupportedLanguage;
(function (SupportedLanguage) {
    SupportedLanguage["ENGLISH"] = "en";
    SupportedLanguage["FRENCH"] = "fr";
    SupportedLanguage["SPANISH"] = "es";
    SupportedLanguage["BRAZILIAN_PORTUGUES"] = "pt-BR";
    SupportedLanguage["GERMAN"] = "de";
    SupportedLanguage["DUTCH"] = "nl";
    SupportedLanguage["ITALIAN"] = "it";
    SupportedLanguage["RUSSIAN"] = "ru";
    SupportedLanguage["JAPANESE"] = "ja";
    SupportedLanguage["DANISH"] = "da";
    SupportedLanguage["SWEDISH"] = "sv";
})(SupportedLanguage = exports.SupportedLanguage || (exports.SupportedLanguage = {}));
var Environment;
(function (Environment) {
    Environment["PROTO_TYPE"] = "insight-timer-prototype";
    Environment["PRE_PROD"] = "insight-timer-preprod";
    Environment["PROD"] = "insight-timer-a1ac7";
    Environment["DEMO"] = "insight-timer-demo";
})(Environment = exports.Environment || (exports.Environment = {}));
var DailyInsightType;
(function (DailyInsightType) {
    DailyInsightType["CURRENT"] = "current";
    DailyInsightType["FUTURE"] = "future";
})(DailyInsightType = exports.DailyInsightType || (exports.DailyInsightType = {}));
var FSWhereOperator;
(function (FSWhereOperator) {
    FSWhereOperator["EQUAL_TO"] = "==";
    FSWhereOperator["LESS_THAN_EQUAL_TO"] = "<=";
    FSWhereOperator["GREATER_THAN_EQUAL_TO"] = ">=";
    FSWhereOperator["LESS_THAN"] = "<";
    FSWhereOperator["GREATER_THAN"] = ">";
    FSWhereOperator["IN"] = "in";
    FSWhereOperator["ARRAY_CONTAINS"] = "array-contains";
    FSWhereOperator["ARRAY_CONTAINS_ANY"] = "array-contains-any";
})(FSWhereOperator = exports.FSWhereOperator || (exports.FSWhereOperator = {}));
var ESIndexName;
(function (ESIndexName) {
    ESIndexName["LIBRARY_ITEMS"] = "libraryitems";
    ESIndexName["PLAYLISTS"] = "playlists";
    ESIndexName["EVENTS"] = "events";
    ESIndexName["USERS"] = "users";
    ESIndexName["HASHTAGS"] = "hashtags";
    ESIndexName["GROUPS"] = "groups";
    ESIndexName["USER_RELATIONS"] = "user_relations";
    ESIndexName["EMAIL_DOMAIN"] = "email_domains";
})(ESIndexName = exports.ESIndexName || (exports.ESIndexName = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "DEBUG";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var ResultSource;
(function (ResultSource) {
    ResultSource["ES"] = "Elastic Search";
    ResultSource["FS"] = "Firestore";
})(ResultSource = exports.ResultSource || (exports.ResultSource = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["APPROVED"] = "APPROVED";
    EventStatus["PENDING"] = "PENDING";
    EventStatus["CANCELLED"] = "CANCELLED";
})(EventStatus = exports.EventStatus || (exports.EventStatus = {}));
var EventPrivacy;
(function (EventPrivacy) {
    EventPrivacy["PUBLIC"] = "PUBLIC";
    EventPrivacy["PRIVATE"] = "PRIVATE";
})(EventPrivacy = exports.EventPrivacy || (exports.EventPrivacy = {}));
var EventType;
(function (EventType) {
    EventType["LIVE_STREAM"] = "LIVE_STREAM";
})(EventType = exports.EventType || (exports.EventType = {}));
var GroupType;
(function (GroupType) {
    GroupType["GROUP"] = "GROUP";
    GroupType["ENTERPRISE"] = "ENTERPRISE";
    GroupType["LEGACY"] = "LEGACY";
})(GroupType = exports.GroupType || (exports.GroupType = {}));
//# sourceMappingURL=enum.js.map