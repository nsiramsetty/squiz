import { useEffect, useState } from 'react';
import { LibraryItemApi } from 'services/libraryItem/api';

const useLibraryItemsTotalCount = () => {
  const [totalCount, setTotalCount] = useState<number>();
  const libraryItemApi = new LibraryItemApi();

  const handleLoadLibraryItems = () => {
    return libraryItemApi
      .headLibraryItemsByFilter({}, 'most_played', 10, 0)
      .then(resp => {
        setTotalCount(resp.total_count || 50000);
      });
  };

  useEffect(() => {
    handleLoadLibraryItems();
  });

  return totalCount;
};

export default useLibraryItemsTotalCount;
