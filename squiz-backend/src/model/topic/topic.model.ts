import { SearchResultResponse } from '../response/search-result.model';

export interface TopicDetail {
  id: string;
  children: TopicDetail[];
  count_library_items: number;
  name: string;
  shortDescription: string;
  topic: string;
  type: string;
}

export interface TopicResponse {
  name: string;
  topics: TopicDetail[];
}

export interface TopicGroupResponse extends SearchResultResponse {
  number_of_topics: number;
  topic_groups: TopicResponse[];
}
