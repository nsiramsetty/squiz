import { useCallback, useState } from 'react';
import { Course } from 'services/courses';
import { LibraryItem } from 'services/singles';
import { getTeacherCollection } from 'services/teacher';

export function useTeacherCollectionQuery() {
  const [teachersCourses, setTeachersCourse] = useState<Course[]>([]);
  const [teachersLibraryItems, setTeachersLibraryItems] = useState<
    LibraryItem[]
  >([]);

  const loadData = useCallback(
    async (teacherID?: string) => {
      if (teacherID != null) {
        try {
          const data = await getTeacherCollection(teacherID);
          if (data != null) {
            setTeachersCourse(data.courses);
            setTeachersLibraryItems(data.libraryitems);
          }
        } catch (error) {
          setTeachersCourse([]);
          setTeachersLibraryItems([]);
        }
      }
    },
    [setTeachersCourse, setTeachersLibraryItems]
  );

  return {
    teachersCourses,
    teachersLibraryItems,
    loadData
  };
}

export default {
  useTeacherCollectionQuery
};
