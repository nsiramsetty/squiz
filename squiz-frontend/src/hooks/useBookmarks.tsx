import { firestore } from 'lib/firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { LooseObject } from 'services/interface';

export interface Bookmark {
  id: string;
  publisher_name: string;
  publisher_id: string;
  title: string;
  rating: number;
  duration_minutes: number;
  media_length_sec?: string;
  last_played_at: {
    epoch: number;
  };
}

export function convert(obj: LooseObject): Bookmark {
  return {
    id: obj.library_item_summary.id,
    publisher_id: obj.library_item_summary.publisher.id,
    publisher_name:
      obj.library_item_summary.publisher &&
      obj.library_item_summary.publisher.name,
    title: obj.library_item_summary.title,
    rating: obj.library_item_summary.rating_score,
    duration_minutes:
      obj.library_item_summary.media_length > 59
        ? Math.floor(obj.library_item_summary.media_length / 60)
        : obj.library_item_summary.media_length,
    media_length_sec: obj.library_item_summary.media_length,
    last_played_at: obj.last_played_at
  };
}

const useBookmarks = (userID: string) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  async function loadBookmarks() {
    firestore
      .collection(`/users/${userID}/library_item_relation`)
      .where('library_item_summary.item_type', '==', 'SINGLE_TRACKS')
      .get()
      .then(documentSnapshots => {
        const bookmarkList = documentSnapshots.docs.map(doc =>
          convert(doc.data())
        );
        setBookmarks(bookmarkList);
      });
  }

  const handleLoadBookmarks = useCallback(loadBookmarks, [userID]);

  useEffect(() => {
    if (userID) {
      handleLoadBookmarks();
    }
  }, [handleLoadBookmarks, userID]);

  return bookmarks;
};

export default useBookmarks;
