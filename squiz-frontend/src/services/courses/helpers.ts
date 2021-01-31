import { Course, Review } from '.';

export const getSelectedReviews = (reviews: Review[]) => {
  return reviews?.filter(
    review => review.rating >= 5 && review.message.length > 15
  );
};

export const getCoursePrice = (course: Course) => {
  if (course == null) return undefined;
  if (course.purchase_tier === 'INSIGHT_10_DAY_COURSE') {
    return 19.99;
  }
  if (course.purchase_tier === 'INSIGHT_30_DAY_COURSE') {
    return 39.99;
  }
  if (course.purchase_tier === 'INSIGHT_FREE_COURSE') {
    return 0.0;
  }
  return undefined;
};

export const courseNumber = 700;
