export enum SearchResultType {
  GROUPS = 'GROUPS',
  HASHTAGS = 'HASHTAGS',
  LIBRARY_ITEMS = 'LIBRARY_ITEMS',
  USERS = 'USERS',
  PUBLISHERS = 'PUBLISHERS',
  PLAYLISTS = 'PLAYLISTS',
  EVENTS = 'EVENTS',
  GRATITUDE_WALL_POSTS = 'GRATITUDE_WALL_POSTS',
  COURSE_DAYS = 'COURSE_DAYS',
  LIBRARY_ITEM_REVIEWS = 'LIBRARY_ITEM_REVIEWS',
  USER_RELATION = 'USER_RELATION',
  TOPICS = 'TOPICS',
  UNKNOWN = 'UNKNOWN',
  ACTIVITY = 'ACTIVITIES',
  EMAIL_DOMAINS = 'EMAIL_DOMAINS',
}

export const SearchResultWeight = {
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

export const SearchSummaryResultKeys = {
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

export enum ESIndex {
  LIBRARY_ITEM = 'alias_libraryitems',
  USER = 'alias_users',
  HASHTAG = 'alias_hashtags',
  GROUP = 'alias_groups',
  PLAYLIST = 'alias_playlists',
  USER_RELATION = 'alias_user_relations',
  COURSE = 'alias_courses',
  MEDITATOR = 'alias_meditators',
  ACTIVITY = 'alias_activities',
  EVENT = 'alias_events',
  EMAIL_DOMAIN = 'alias_email_domains',
}

export enum Collection {
  COURSES = 'courses',
  GROUPS = 'groups',
  USERS = 'users',
  HASHTAGS = 'hashtags',
  LIBRARY_ITEMS = 'libraryitems',
  PLAYLISTS = 'playlists',
  EVENTS = 'events',
  TOPICS = 'topics',
  COMPANY_CONTENT_MAP = 'company_content_map',
  LIBRARY_PAGES = 'library_pages',
  BEGINNER_KITS = 'beginner_kits',
  ADMIN = 'admin',
  INFLUENCERS = 'influencers',
  WEB_SESSIONS = 'web_sessions',
  CURATED_LIBRARY_ITEMS = 'curated_library_items',
  CURATED_COURSES = 'curated_courses',
  TEAMS = 'teams',
  EMAIL_DOMAIN = 'email_domains',
}

export enum ItemType {
  SINGLE_TRACKS = 'SINGLE_TRACKS',
  COURSES = 'COURSES',
  DAILY_INSIGHT = 'DAILY_INSIGHT',
}

export enum SupportedLanguage {
  ENGLISH = 'en',
  FRENCH = 'fr',
  SPANISH = 'es',
  BRAZILIAN_PORTUGUES = 'pt-BR',
  GERMAN = 'de',
  DUTCH = 'nl',
  ITALIAN = 'it',
  RUSSIAN = 'ru',
  JAPANESE = 'ja',
  DANISH = 'da',
  SWEDISH = 'sv',
}

export enum Environment {
  PROTO_TYPE = 'insight-timer-prototype',
  PRE_PROD = 'insight-timer-preprod',
  PROD = 'insight-timer-a1ac7',
  DEMO = 'insight-timer-demo',
}

export enum DailyInsightType {
  CURRENT = 'current',
  FUTURE = 'future',
}

export enum FSWhereOperator {
  EQUAL_TO = '==',
  LESS_THAN_EQUAL_TO = '<=',
  GREATER_THAN_EQUAL_TO = '>=',
  LESS_THAN = '<',
  GREATER_THAN = '>',
  IN = 'in',
  ARRAY_CONTAINS = 'array-contains',
  ARRAY_CONTAINS_ANY = 'array-contains-any',
}

export enum ESIndexName {
  LIBRARY_ITEMS = 'libraryitems',
  PLAYLISTS = 'playlists',
  EVENTS = 'events',
  USERS = 'users',
  HASHTAGS = 'hashtags',
  GROUPS = 'groups',
  USER_RELATIONS = 'user_relations',
  EMAIL_DOMAIN = 'email_domains',
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'DEBUG',
}

export enum ResultSource {
  ES = 'Elastic Search',
  FS = 'Firestore',
}

export enum EventStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export enum EventPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum EventType {
  LIVE_STREAM = 'LIVE_STREAM',
}

export enum GroupType {
  GROUP = 'GROUP',
  ENTERPRISE = 'ENTERPRISE',
  LEGACY = 'LEGACY',
}
