import Axios from 'axios';
import queryString from 'query-string';
import { Course } from 'services/courses';
import { LibraryItem } from 'services/singles';

const API_HOST = 'https://filtering.insighttimer-api.net';

export type TTypeOption = 'guided' | 'talks' | 'music' | undefined;
export type TLengthRange = '0to5' | '5to30' | '30to' | '' | undefined;
export type TVoiceOption = 'male' | 'female' | '' | undefined;
export type TSortOption =
  | 'most_played'
  | 'highest_rated'
  | 'newest'
  | 'popular';

export interface TReferenceOption {
  hide_spiritual?: boolean;
  hide_religious?: boolean;
}

export interface Filter {
  ids?: string;
  publisher_ids?: string[];
  content_types?: TTypeOption[];
  sort_option?: TSortOption;
  length_range?: TLengthRange;
  voice_gender?: TVoiceOption;
  ignore_langs?: boolean;
  is_religious?: boolean;
  is_spiritual?: boolean;
  has_background_music?: boolean;
  device_lang?: string;
  content_langs?: string[];
  topics?: string[];
  size?: number;
  limit?: number;
  offset?: number;
}

interface LibraryItemFilterResponse {
  item_summary: {
    library_item_summary: LibraryItem;
  };
}

interface CourseFilterResponse {
  item_summary: {
    library_item_summary?: Course;
    course_summary?: Course;
  };
}

export const getFilteredCourses = async (
  filter?: Filter
): Promise<{
  result?: Course[];
  totalCount?: number;
}> => {
  const query = filter
    ? queryString.stringify(filter, {
        arrayFormat: 'comma'
      })
    : '';
  const response = await Axios.get(
    `${API_HOST}/api/v1/courses/filter?${query}`
  );
  const { data } = response;
  const result = data.map((r: CourseFilterResponse) => {
    if (r.item_summary.library_item_summary != null)
      return r.item_summary.library_item_summary;

    if (r.item_summary.course_summary != null)
      return r.item_summary.course_summary;

    return null;
  });

  return {
    result,
    totalCount: response.headers['x-total-count']
  };
};

export const getFilteredLibraryItems = async (
  filter?: Filter
): Promise<{
  result?: LibraryItem[];
  totalCount?: number;
}> => {
  const query = filter
    ? queryString.stringify(filter, {
        arrayFormat: 'comma'
      })
    : '';
  const response = await Axios.get(
    `${API_HOST}/api/v1/single-tracks/filter?${query}`
  );
  const { data } = response;
  const result = data.map((r: LibraryItemFilterResponse) => {
    return r.item_summary.library_item_summary;
  });

  return {
    result,
    totalCount: response.headers['x-total-count']
  };
};
