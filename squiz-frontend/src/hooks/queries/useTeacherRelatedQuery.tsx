import { useCallback, useState } from 'react';
import { LibraryItem } from 'services/singles';
import { getTeacherRelated } from 'services/teacher';

export function useTeacherRelatedQuery() {
  const [related, setRelated] = useState<{
    related_libraryitems: LibraryItem[];
  }>({
    related_libraryitems: []
  });

  const loadData = useCallback(
    async (id: string, contentLang: string) => {
      const data = await getTeacherRelated(id, contentLang);
      if (data != null) {
        setRelated(data);
      }
    },
    [setRelated]
  );

  return {
    relatedLibraryItems: related.related_libraryitems,
    loadData
  };
}

export default {
  useTeacherRelatedQuery
};
