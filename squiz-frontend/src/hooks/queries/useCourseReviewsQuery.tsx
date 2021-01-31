import { useCallback, useState } from 'react';
import { Course, getCourseReviews, Review } from 'services/courses';
import { getSelectedReviews } from 'services/courses/helpers';

export function useCourseReviewsQuery() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadData = useCallback(
    async (course: Course) => {
      if (course != null) {
        const data = await getCourseReviews(course.id);
        if (data != null) {
          setReviews(data);
        }
      }
    },
    [setReviews]
  );

  return {
    reviews,
    selectedReviews: getSelectedReviews(reviews),
    loadData
  };
}

export default {
  useCourseReviewsQuery
};
