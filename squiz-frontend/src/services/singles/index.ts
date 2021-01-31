import Axios from 'axios';
import { Course, Lang, Review, UserSummary } from 'services/courses';
import { Epoch } from 'services/teacher';

export interface LibraryItemSummary {
  content_type: 'MUSIC' | 'GUIDED' | 'TALK';
  has_background_music: boolean;
  id: string;
  is_newage: boolean;
  is_religion: boolean;
  is_science: boolean;
  is_secular: boolean;
  is_spirituality: boolean;
  item_type: 'COURSES' | 'SINGLE_TRACKS' | 'DAILY_INSIGHT';
  lang: Lang;
  media_length: number;
  media_length_group: '00-05' | '06-10' | '11-15' | '16-20' | '21-30' | '30';
  publisher: UserSummary;
  rating_score: number;
  short_description: string;
  slug: string;
  title: string;
  voice_gender: 'MALE' | 'FEMALE';
}

export interface LibraryItem {
  activity: string;
  content_type: 'MUSIC' | 'GUIDED' | 'TALK';
  has_background_music: boolean;
  id: string;
  is_newage: boolean;
  is_religion: boolean;
  is_science: boolean;
  is_secular: boolean;
  is_spirituality: boolean;
  item_type: 'COURSES' | 'SINGLE_TRACKS' | 'DAILY_INSIGHT';
  level: string;
  lang: Lang;
  long_description: string;
  media_length: number;
  media_length_group: '00-05' | '06-10' | '11-15' | '16-20' | '21-30' | '30';
  music_type: string;
  publisher: UserSummary;
  rating_score: number;
  rating_count: number;
  play_count: number;
  short_description: string;
  slug: string;
  title: string;
  topics: string[];
  voice_gender: 'MALE' | 'FEMALE';
  created_at: Epoch;
  _selected_reviews: Review[];
}

const API_HOST = 'https://insight-timer-api.firebaseapp.com';
const SEO_HOST = 'https://seo.insighttimer-api.net';

export const getSinglesTrack = async (slug: string): Promise<LibraryItem> => {
  const response = await Axios.get(
    `${SEO_HOST}/api/libraryitems/${slug}/details`
  );
  const { data } = response;
  return data;
};

export const getSinglesTrackReviews = async (courseId: string) => {
  const response = await Axios.get(
    `${API_HOST}/apiLibraryItemReviewsByItemId/request?id=${courseId}&offset=0&limit=30`
  );
  const { data } = response;
  return data.result;
};

export const getSinglesTrackRelated = async (
  id: string,
  topics: string[],
  contentLang: string
): Promise<{
  related_libraryitems: LibraryItem[];
  related_courses: Course[];
}> => {
  const topicsCsv = topics.join(',');
  const response = await Axios.get(
    `${SEO_HOST}/api/libraryitems/${id}/related?topics=${topicsCsv}&content_lang=${contentLang}`
  );
  const { data } = response;
  return data;
};
