import { SearchResultResponse } from '../response/search-result.model';

export const SINGLE_TRACK_SUMMARY_FIELDS = [
  'id',
  'title',
  'play_count',
  'media_length',
  'rating_score',
  'rating_count',
  'content_type',
  'publisher',
  'lang',
  'status',
  'item_type',
  'is_newage',
  'is_religion',
  'is_religious',
  'is_science',
  'is_scientific',
  'is_secular',
  'is_spiritual',
  'is_spirituality',
  'description',
  'long_description',
  'learn_description',
  'short_description',
  'slug',
];

export const DAILY_INSIGHT_ITEM_SUMMARY_FIELDS = [
  'approved_at',
  'calendar_id',
  'classroom_id',
  'content_type',
  'created_at',
  'focus_for_the_day',
  'hashtags',
  'id',
  'insight_url',
  'item_type',
  'lang',
  'play_count',
  'publisher',
  'publisher_first_name',
  'slug',
  'status',
  'title',
  'topics',
  'updated_at',
  'web_url',
];

export const COURSE_DAY_SUMMARY_FIELDS = [
  'day',
  'id',
  'length',
  'media_paths',
  'options',
  'outline',
  'question',
  'skip_option',
  'title',
];

export const LIBRARY_ITEM_REVIEW_SUMMARY_FIELDS = [
  'created_at',
  'has_message',
  'message',
  'author',
  'owner',
  'libraryItemId',
  'rating',
  'replies',
  'updated_at',
  'user_summary',
];

export interface LibraryItemResponse extends SearchResultResponse {
  title: string;
  publisher: {
    id: string;
    publisher_follower_count: number;
  };
}

export const COURSE_SUMMARY_FIELDS = [
  'approved_at',
  'brand_hex_color',
  'calendar_id',
  'content_type',
  'created_at',
  'days',
  'filters',
  'from',
  'has_background_music',
  'hashtags',
  'id',
  'insight_url',
  'is_newage',
  'is_religion',
  'is_religious',
  'is_science',
  'is_scientific',
  'is_secular',
  'is_spiritual',
  'is_spirituality',
  'item_type',
  'lang',
  'level',
  'long_description',
  'media_length',
  'media_paths_audio_intro',
  'minutes_per_day',
  'music_type',
  'number_of_students',
  'play_count',
  'publisher',
  'publisher_intro',
  'purchase_tier',
  'query',
  'rating_count',
  'rating_score',
  'short_description',
  'size',
  'slug',
  'status',
  'title',
  'title_hex_color',
  'title_html',
  'topics',
  'total_day_track_size',
  'updated_at',
  'voice_gender',
  'web_url',
];

export const LIBRARY_ITEM_SUMMARY_FIELDS = [
  ...SINGLE_TRACK_SUMMARY_FIELDS,
  ...DAILY_INSIGHT_ITEM_SUMMARY_FIELDS,
  ...COURSE_SUMMARY_FIELDS,
];

export const COURSE_SUMMARY_TOP_VIEW_FIELDS = [
  'id',
  'days',
  'item_type',
  'lang',
  'publisher.id',
  'publisher.name',
  'purchase_tier',
  'rating_score',
  'title',
];

export const SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS = [
  'id',
  'item_type',
  'lang',
  'rating_score',
  'publisher.id',
  'publisher.name',
  'title',
  'content_type',
  'media_length',
  'media_length_group',
  'voice_gender',
  'has_background_music',
  'is_religion',
  'is_spirituality',
  'is_newage',
  'is_science',
  'is_secular',
  'slug',
  'score',
];

export const DAILY_INSIGHT_ITEM_SUMMARY_TOP_VIEW_FIELDS = [
  'id',
  'item_type',
  'lang',
  'rating_score',
  'publisher.id',
  'publisher.name',
  'title',
  'calendar_id',
];

export interface CourseResponse extends SearchResultResponse {
  title_html: string;
  title: string;
  name_html: string;
}

export const LIBRARY_ITEM_SUMMARY_TOP_VIEW_FIELDS = [
  ...SINGLE_TRACK_SUMMARY_TOP_VIEW_FIELDS,
  ...COURSE_SUMMARY_TOP_VIEW_FIELDS,
];
