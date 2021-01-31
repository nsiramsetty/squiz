import { useCallback, useState } from 'react';
import { Course } from 'services/courses';
import { Filter, getFilteredCourses } from 'services/filtering';

export function useFilteredCoursesQuery() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState<number>();

  const loadData = useCallback(
    async (filter: Filter) => {
      const data = await getFilteredCourses(filter);
      if (data != null) {
        setCourses(data.result || []);
        setTotalCount(data.totalCount);
      }
    },
    [setCourses]
  );

  return {
    courses,
    totalCount,
    loadData
  };
}

export default {
  useFilteredCoursesQuery
};
