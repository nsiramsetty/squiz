import { LibraryItem } from 'lib/models/libraryItem';
import { useCallback, useEffect, useState } from 'react';
import { ApiResponse } from 'services/interface';
import { LibraryItemApi } from 'services/libraryItem/api';
import { Filter, TSortOption } from 'services/libraryItem/interface';

const libraryItemApi = new LibraryItemApi();

export const useFilteredLibraryItems = (
  filterObj: Filter,
  sortOption: TSortOption = 'popular',
  limit: number = 10,
  offset: number = 0,
  topic?: string
): ApiResponse<LibraryItem> => {
  const [gms, setGms] = useState<ApiResponse<LibraryItem>>({
    data: [],
    total_count: 0
  });

  const handleLoadLibraryItems = useCallback(() => {
    libraryItemApi
      .getLibraryItemsByFilter(filterObj, sortOption, limit, offset, topic)
      .then(resp => {
        setGms(resp);
      });
  }, [filterObj, sortOption, limit, offset, topic]);

  useEffect(() => {
    handleLoadLibraryItems();
  }, [handleLoadLibraryItems]);

  return { total_count: gms.total_count, data: gms.data };
};

export default useFilteredLibraryItems;
