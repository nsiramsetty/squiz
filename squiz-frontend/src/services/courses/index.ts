import Axios from 'axios';

export interface DateTime {
  epoch: number;
}

export interface UserSummary {
  has_avatar?: boolean;
  id: string;
  is_publisher?: boolean;
  name: string;
  region?: { name?: string };
  username?: string;
}

export interface Lang {
  name: string;
  iso_639_1: string;
}

export interface CourseSummary {
  days: number;
  id: string;
  item_type: 'COURSES';
  lang: Lang;
  long_description: string;
  minutes_per_day: number;
  number_of_students: number;
  publisher: UserSummary;
  purchase_tier:
    | 'INSIGHT_10_DAY_COURSE'
    | 'INSIGHT_30_DAY_COURSE'
    | 'INSIGHT_FREE_COURSE';
  rating_score: number;
  slug: string;
  title: string;
  web_url: string;
}

export interface CourseDay {
  id: string;
  day: number;
  outline: string;
  title: string;
}

export interface Course {
  brand_hex_color: string;
  course_days: CourseDay[];
  days: number;
  id: string;
  item_type: 'COURSES';
  lang: Lang;
  long_description: string;
  minutes_per_day: number;
  number_of_students: number;
  publisher: UserSummary;
  publisher_intro: string;
  purchase_tier:
    | 'INSIGHT_10_DAY_COURSE'
    | 'INSIGHT_30_DAY_COURSE'
    | 'INSIGHT_FREE_COURSE';
  rating_count: number;
  rating_score: number;
  short_description: string;
  slug: string;
  title: string;
  topics: string[];
  total_day_track_size: number;
  web_url: string;
  _selected_reviews: Review[];
  // legacy_question_thread: string;
  // legacy_review_thread: string;
  // insight_url: string;
  // web_url: string;
}

export interface Review {
  updated_at: DateTime;
  created_at: DateTime;
  rated_at: DateTime;
  has_message: boolean;
  message: string;
  rating: number;
  owner: UserSummary;
}

const API_HOST = 'https://insight-timer-api.firebaseapp.com';
const SEO_HOST = 'https://seo.insighttimer-api.net';

export const getCourse = async (slug: string): Promise<Course> => {
  const response = await Axios.get(`${SEO_HOST}/api/courses/${slug}/details`);
  const { data } = response;
  return data;
};

export const getCourseReviews = async (courseId: string) => {
  const response = await Axios.get(
    `${API_HOST}/apiLibraryItemReviewsByItemId/request?id=${courseId}&offset=0&limit=40`
  );
  const { data } = response;
  return data.result;
};
