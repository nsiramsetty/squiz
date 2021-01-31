import { useCallback, useState } from 'react';
import { getSinglesTrack, LibraryItem } from 'services/singles';

export function useSinglesTrackQuery() {
  const [libraryItem, setLibraryItem] = useState<LibraryItem | null>();

  const loadData = useCallback(
    async (singleSlug: string) => {
      if (singleSlug != null) {
        try {
          const data = await getSinglesTrack(singleSlug);
          if (data != null) {
            setLibraryItem(data);
          }
        } catch (error) {
          console.warn(`getSingle:${singleSlug}`, error);
          setLibraryItem(null);
        }
      }
    },
    [setLibraryItem]
  );

  return {
    libraryItem,
    loadData
  };
}

export default {
  useSinglesTrackQuery
};
