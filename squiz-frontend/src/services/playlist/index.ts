import Axios from 'axios';
import assign from 'lodash/assign';
import queryString from 'query-string';
import { ApiResponse, LooseObject } from 'services/interface';
import { HOST_URL } from '../../Config/constants';
import { Playlist } from './models';

export function convertPlaylist(data: LooseObject): Playlist {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    followers: data.number_of_followers,
    private: data.is_private,
    owner_username: data.owner.username,
    owner_name: data.owner.name,
    owner_id: data.owner.id,
    is_owner_publisher: data.owner.is_publisher,
    tracks: data.library_item_summaries,
    hashtags: data.hashtags
  } as Playlist;
}

class PlaylistApi {
  getPlaylistById(id: string): Promise<Playlist> {
    return Axios.get(`${HOST_URL}/apiPlaylistGet/request/${id}/playlist`).then(
      resp => {
        const { data } = resp;
        return convertPlaylist(data.playlist);
      }
    );
  }

  getRelatedPlaylistsById(id: string): Promise<Playlist[]> {
    return Axios.get(
      `${HOST_URL}/apiPlaylistGet/request/${id}/related?include_description=true`
    ).then(resp => {
      const data = resp.data.related_playlists;
      const res = data.map((doc: LooseObject) => {
        const playlist = convertPlaylist(doc);
        return playlist;
      });
      return res;
    });
  }

  getFeaturedPlaylists(
    entry_point: string = 'featured_playlists_20191220'
  ): Promise<Playlist[]> {
    return Axios.get(
      `${HOST_URL}/apiAsFrontEndFeaturedList/v2/request/summary?entry_point=${entry_point}&device_lang=en&content_langs=en`
    ).then(resp => {
      const data = resp.data.items.filter(
        (item: LooseObject) => item.featured_list_item_type === 'PLAYLISTS'
      );
      const res = data.map((doc: LooseObject) => {
        const playlist = convertPlaylist(doc.playlist_summary);
        playlist.description = doc.description;
        return playlist;
      });
      return res || [];
    });
  }

  async getPlaylistsByFilter(
    filter: {
      hashtags?: string;
      region_city?: string;
      region_country?: string;
    },
    sortOption = 'popular',
    from?: number,
    size?: number
  ): Promise<ApiResponse<Playlist>> {
    const queryObject = assign(filter, {
      sort_option: sortOption,
      from,
      size,
      include_description: true
    });

    return Axios.get(
      `${HOST_URL}/apiPlaylists/request/filter?${queryString.stringify(
        queryObject
      )}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convertPlaylist(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }
}

export const playlistApi = new PlaylistApi();
