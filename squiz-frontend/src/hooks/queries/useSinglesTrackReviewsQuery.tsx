import { useCallback, useState } from 'react';
import { Review } from 'services/courses';
import { getSelectedReviews } from 'services/courses/helpers';
import { getSinglesTrackReviews, LibraryItem } from 'services/singles';

export function useSinglesTrackReviewsQuery() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadData = useCallback(
    async (libraryitem: LibraryItem) => {
      if (libraryitem != null) {
        const data = await getSinglesTrackReviews(libraryitem.id);
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
  useSinglesTrackReviewsQuery
};
