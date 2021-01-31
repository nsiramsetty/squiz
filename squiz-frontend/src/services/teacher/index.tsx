import Axios from 'axios';
import { Course } from 'services/courses';
import { LibraryItem } from 'services/singles';

export interface Epoch {
  epoch: number;
}

export interface User {
  accept_donations?: boolean;
  has_avatar?: boolean;
  id: string;
  is_publisher?: boolean;
  name: string;
  region?: { name?: string };
  username?: string;
  tagline?: string;
  created_at?: Epoch;
  follower_count?: number;
  publisher_follower_count?: number;
  publisher_play_count?: number;
  publisher_description?: string;
  total_minutes?: number;
}

export interface CollectionResponse {
  courses: Course[];
  libraryitems: LibraryItem[];
}

const API_HOST = 'https://insight-timer-api.firebaseapp.com';
const SEO_HOST = 'https://seo.insighttimer-api.net';
const SITEMAP_HOST = 'https://sitemap.insighttimer-api.net';

export const getTeacher = async (slug: string): Promise<User> => {
  const response = await Axios.get(
    `${API_HOST}/apiSlugGet/request/slugs/users/${slug}`
  );
  const { data } = response;
  return data.ref_doc;
};

export const getTeacherRelated = async (
  id: string,
  contentLang: string
): Promise<{
  related_libraryitems: LibraryItem[];
}> => {
  const response = await Axios.get(
    `${SEO_HOST}/api/teachers/${id}/related?content_lang=${contentLang}`
  );
  const { data } = response;
  return data;
};

export const getTeacherCollection = async (
  teacherID: string
): Promise<CollectionResponse> => {
  const response = await Axios.get(
    `${SITEMAP_HOST}/teachers/${teacherID}.json`
  );
  const { data } = response;
  return data;
};
