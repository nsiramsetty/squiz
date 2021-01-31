import { useCallback, useState } from 'react';
import { Course } from 'services/courses';
import { getSinglesTrackRelated, LibraryItem } from 'services/singles';

export function useRelatedLibraryItemsQuery() {
  const [related, setRelated] = useState<{
    related_courses: Course[];
    related_libraryitems: LibraryItem[];
  }>({
    related_courses: [],
    related_libraryitems: []
  });

  const loadData = useCallback(
    async (libraryItem: LibraryItem, contentLang: string) => {
      const data = await getSinglesTrackRelated(
        libraryItem.id,
        libraryItem.topics.slice(0, 2),
        contentLang
      );
      if (data != null) {
        setRelated(data);
      }
    },
    [setRelated]
  );

  return {
    relatedCourses: related.related_courses,
    relatedLibraryItems: related.related_libraryitems,
    loadData
  };
}

export default {
  useRelatedLibraryItemsQuery
};
