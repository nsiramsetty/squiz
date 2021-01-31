import { SearchResultType } from '../../shared/enum';
import HTTPSuccessResponse from '../../shared/http/http-200-success';
import { SearchResultResponse } from '../response/search-result.model';

export interface TopViewUnifiedSearchResponse extends HTTPSuccessResponse {
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
  event_summary?: SearchResultResponse;
}

export interface TopViewResponse {
  id?: string;
  search_result_type?: SearchResultType;
  score?: number;
  index?: string;
  item_type?: string;
}

export interface TopViewSearchResponse {
  total: number;
  items: TopViewUnifiedSearchResponse[];
}
