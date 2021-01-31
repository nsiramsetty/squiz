import { ApiResponse } from 'services/interface';

export type TSortOption =
  | 'most_played'
  | 'highest_rated'
  | 'newest'
  | 'popular';

export type Publisher = {
  name?: string;
  description?: string;
  id?: string;
  avatar?: string;
  follower_count?: number;
  play_count?: number;
  location?: string;
  created_at?: number;
  slug?: string;
  publisher_avatar?: string;
  publisher_name?: string;
  publisher_play_count?: string;
};

export interface PublisherService {
  getPublisherById(id: string): Promise<Publisher>;

  getPublisherBySlug(slug: string): Promise<Publisher>;

  searchPublisherByIds(
    ids: string[],
    size: number,
    from?: number
  ): Promise<ApiResponse<Publisher>>;
}
