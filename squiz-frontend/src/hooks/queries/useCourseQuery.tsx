import { useCallback, useState } from 'react';
import { Course, getCourse } from 'services/courses';
import { getCoursePrice } from 'services/courses/helpers';

export function useCourseQuery() {
  const [course, setCourse] = useState<Course | null>();

  const loadData = useCallback(
    async (courseSlug: string) => {
      if (courseSlug != null) {
        try {
          const data = await getCourse(courseSlug);
          if (data != null) {
            setCourse(data);
          }
        } catch (error) {
          console.warn(`getCourse:${courseSlug}`, error);
          setCourse(null);
        }
      }
    },
    [setCourse]
  );

  return {
    course,
    coursePrice: course != null && getCoursePrice(course),
    loadData
  };
}

export default {
  useCourseQuery
};
