import HTTPSuccessResponse from '../../shared/http/http-200-success';

export const HASHTAG_SUMMARY_FIELDS = [
  'id',
  'name',
  'lang',
  'image',
  'topic',
  'short_description',
  'long_description',
  'created_at',
  'updated_at',
];

export const HASHTAG_SUMMARY_TOP_VIEW_FIELDS = ['id', 'name', 'topic', 'lang'];

export const TRENDING_HASHTAG_SUMMARY_FIELDS = [
  'id',
  'cover_image_library_item_id',
  'title',
  'owner',
  'name',
  'topic',
  'is_private',
  'hashtags',
  'description',
  'created_at',
];

export interface HashtagResponse extends HTTPSuccessResponse {
  hashtag: string;
}

export interface HashtagModel extends HTTPSuccessResponse {
  key: string;
  doc_count: number;
}
