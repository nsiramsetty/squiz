import { LibraryItem } from 'services/libraryItem/interface';
import { Publisher } from 'services/publisher/interface';
import { ApiResponse, LooseObject } from 'services/interface';

export interface CarouselService {
  getLibraryItems(
    query: LooseObject,
    limit: number,
    from?: number
  ): Promise<ApiResponse<LibraryItem>>;
  getCourses(
    query: LooseObject,
    limit: number,
    from?: number
  ): Promise<ApiResponse<LibraryItem>>;
  getPublishers(
    query: LooseObject,
    limit: number,
    from?: number
  ): Promise<ApiResponse<Publisher>>;
}
