import { ResultSource, SearchResultType } from '../../shared/enum';

export interface SearchResultResponse {
  id: string;
  search_result_type: SearchResultType;
  score?: number;
  source?: ResultSource;
}

export interface UnifiedSearchResponse {
  item_summary: UnifiedSearchItem;
  relation?: RelationSummary;
}

export interface RelationSummary {
  is_friend?: boolean;
  is_friend_of_friend?: boolean;
  mutual_friends?: string[];
  is_member: boolean;
  friends: string[];
}

export interface UnifiedSearchItem {
  type?: SearchResultType;
  topic_summary?: SearchResultResponse;
  course_summary?: SearchResultResponse;
  playlist_summary?: SearchResultResponse;
  user_summary?: SearchResultResponse;
  single_track_summary?: SearchResultResponse;
  hashtag_summary?: SearchResultResponse;
  group_summary?: SearchResultResponse;
  daily_insight_summary?: SearchResultResponse;
  library_item_summary?: SearchResultResponse;
}
