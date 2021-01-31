import { SearchResultResponse } from '../response/search-result.model';

export const PLAYLIST_SUMMARY_FIELDS = [
  'id',
  'cover_image_library_item_id',
  'title',
  'is_private',
  'owner.username',
  'owner.id',
  'owner.name',
  'owner.milestone',
  'owner.has_avatar',
  'owner.region.name',
  'hashtags',
  'number_of_library_items',
  'created_at',
];

export const PLAYLIST_SUMMARY_TOP_VIEW_FIELDS = [
  'id',
  'cover_image_library_item_id',
  'title',
  'is_private',
  'owner.id',
  'owner.name',
];

export const PLAYLIST_DETAIL_FIELDS = [
  'id',
  'owner',
  'cover_image_library_item_id',
  'title',
  'is_private',
  'whitelisted_users',
  'description',
  'hashtags',
  'number_of_library_items',
];

export interface PlayListResponse extends SearchResultResponse {
  title: string;
  hashtags?: string[];
  number_of_library_items?: number;
  owner: { id: string };
  library_item_summaries: LibraryItemSummaries[];
  cover_image_library_item_id: string;
}

export interface LibraryItemSummaries {
  id: string;
}
