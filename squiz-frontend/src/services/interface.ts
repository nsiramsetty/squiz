export type ApiResponse<T> = {
  total_count: number;
  featuredListTitle?: string;
  data: T[];
};

export type ApiFeaturedlistResponse<T> = {
  featured_list_type: string;
  playlist_summary: T[];
};

export interface LooseObject {
  [key: string]: any;
}
