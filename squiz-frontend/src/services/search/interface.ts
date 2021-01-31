import { ApiResponse } from 'services/interface';

export interface SearchService {
  getSearchItems(
    query: string,
    limit: number,
    from?: number
  ): Promise<ApiResponse<any>>;
}
