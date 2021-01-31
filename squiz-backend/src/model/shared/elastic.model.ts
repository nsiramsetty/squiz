import { ResultSource, SearchResultType } from '../../shared/enum';
import { EventOccurrence } from '../event/event.model';

export interface ESSingleIndexSearchResponse {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: number;
    max_score: number;
    hits: ESSearchHITResponse[];
  };
}

export interface ESMultiIndexSearchResponse {
  responses: ESSingleIndexSearchResponse[];
}

export interface ESMultiDocGETSearchResponse {
  docs: ESSearchHITResponse[];
}

export interface ESSearchHITResponse {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _version: number;
  _source: ESSearchDOCSourceResponse;
}

export interface ESSearchDOCSourceResponse {
  id: string;
  search_result_type: SearchResultType;
  item_type?: string;
  source?: ResultSource;
  score: number;
  friends?: string[];
  groups?: string[];
  followings?: string[];
  is_friend?: boolean;
  mutual_friends?: {
    name?: string;
    id?: string;
  }[];
  _next_occurrences?: EventOccurrence[];
  is_deleted?: boolean;
}

export interface ESSearchTransformResponse {
  total: number;
  items: ESSearchDOCSourceResponse[];
}
