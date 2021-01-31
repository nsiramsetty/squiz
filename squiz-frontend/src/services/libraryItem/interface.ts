import { ApiResponse } from 'services/interface';

export type TTypeOption = 'guided' | 'talks' | 'music' | undefined;

export type TLengthRange = '0to5' | '5to30' | '30to' | '' | undefined;
export type TVoiceOption = 'male' | 'female' | '' | undefined;
export type TSortOption =
  | 'most_played'
  | 'highest_rated'
  | 'newest'
  | 'popular';
export type TReferenceOption = {
  hide_spiritual?: boolean;
  hide_religious?: boolean;
};

export type LibraryItem = {
  slug?: string;
  id?: string;
  title?: string;
  description?: string;
  duration_minutes?: number;
  duration_days?: number;
  rating_count?: number;
  rating?: number;
  play_count?: number;
  created_at?: string;
  publisher_name?: string;
  publisher_username?: string;
  publisher_id?: string;
  publisher_location?: string;
  publisher_avatar?: string;
  background_image?: string;
  student_count?: number;
  topics?: string[];
  web_url?: string;
  level?: string;
  content_type?: string;
  type?: 'COURSE' | 'SINGLE';
  purchase_tier?:
    | 'INSIGHT_10_DAY_COURSE'
    | 'INSIGHT_FREE_COURSE'
    | 'INSIGHT_30_DAY_COURSE';
  brand_hex_color?: string;
  media_length_sec?: string;
  picture?: Picture;
  publisher?: Publisher;
  media_length?: string;
};
export type Publisher = {
  name: string;
  id: string;
};
export type Picture = {
  small: string;
  medium: string;
  large?: string;
};

export type Course = LibraryItem & {
  purchase_tier?: string;
  media_paths_audio_intro?: string[];
  course_days?: CourseDay[];
  current_day?: number;
};

interface CourseDay {
  title: string;
  day: number;
  outline: string;
}

export type Filter = {
  ids?: string[];
  filterType?: TTypeOption[];
  filterLength?: TLengthRange;
  filterVoice?: TVoiceOption;
  hideReligious?: boolean;
  hideSpiritual?: boolean;
  backgroundMusic?: boolean;
  deviceLang?: string;
  contentLangs?: string;
};

export type Review = {
  avatar: string;
  author: string;
  rating: number;
  message: string;
};

export interface LibraryItemService {
  getLibraryItemsByFilter(
    filter: Filter,
    sortOption: TSortOption,
    limit: number,
    offset: number,
    topic?: string
  ): Promise<ApiResponse<LibraryItem>>;

  headLibraryItemsByFilter(
    filter: Filter,
    sortOption: TSortOption,
    limit: number,
    offset: number,
    topic?: string
  ): Promise<ApiResponse<LibraryItem>>;

  getLibraryItemsByPublisher(
    publisher_id: string,
    sort_option: TSortOption,
    limit: number,
    offset: number
  ): Promise<ApiResponse<LibraryItem>>;

  getReviewsById(id: string, limit: number, offset: number): Promise<Review[]>;

  getLibraryItemBySlug(slug: string): Promise<LibraryItem>;

  getLibraryItemById(id: string): Promise<LibraryItem>;

  getCourseBySlug(slug: string): Promise<Course>;

  getCoursesByPublisher(
    publisher_id: string,
    sort_option: TSortOption,
    limit: number,
    offset: number
  ): Promise<ApiResponse<LibraryItem>>;

  getCoursesByFilter(
    filterObj: Filter,
    sort_option: TSortOption,
    limit: number,
    offset: number,
    filter?: string
  ): Promise<ApiResponse<LibraryItem>>;
}
