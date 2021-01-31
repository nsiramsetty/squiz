import { firestore } from 'lib/firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { convertPlaylist } from 'services/playlist/index';
import { Playlist } from 'services/playlist/models';

const usePlaylists = (userID: string) => {
  const [ownedPlaylists, setOwnedPlaylists] = useState<Playlist[]>([]);
  const [followedPlaylists, setFollowedPlaylists] = useState<Playlist[]>([]);
  async function loadPlaylists() {
    firestore
      .collection(`/users/${userID}/playlist_relation`)
      .orderBy('followed_at.epoch', 'desc')
      .get()
      .then(documentSnapshots => {
        const allPlaylists = documentSnapshots.docs.map(doc =>
          convertPlaylist(doc.data().playlist_summary)
        );
        const ownedPlaylists = allPlaylists.filter(
          playlist => playlist.owner_id === userID
        );
        const followedPlaylists = allPlaylists.filter(
          playlist => playlist.owner_id !== userID
        );

        setOwnedPlaylists(ownedPlaylists);
        setFollowedPlaylists(followedPlaylists);
      });
  }

  const handleLoadPlaylists = useCallback(loadPlaylists, [userID]);

  useEffect(() => {
    if (userID) {
      handleLoadPlaylists();
    }
  }, [handleLoadPlaylists, userID]);

  return [ownedPlaylists, followedPlaylists];
};

export default usePlaylists;
