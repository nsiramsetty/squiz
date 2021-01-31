import { useCallback, useState } from 'react';
import { Filter, getFilteredLibraryItems } from 'services/filtering';
import { LibraryItem } from 'services/singles';

export function useFilteredLibraryItemsQuery() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>();

  const loadData = useCallback(
    async (filter: Filter) => {
      const data = await getFilteredLibraryItems(filter);
      if (data != null) {
        setLibraryItems(data.result || []);
        setTotalCount(data.totalCount);
      }
    },
    [setLibraryItems]
  );

  return {
    libraryItems,
    totalCount,
    loadData
  };
}

export default {
  useFilteredLibraryItemsQuery
};
