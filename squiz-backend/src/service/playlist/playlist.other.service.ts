// import path from 'path';
import { ParsedQs } from 'qs';
import { PlayListResponse } from '../../model/playlist/playlist.model';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { UnifiedSearchResponse } from '../../model/response/search-result.model';
import { FSSearchDOCSourceResponse, FSSearchTransformResponse } from '../../model/shared/firestore.model';
// import logger from '../../shared/logger';
import transformToUnifiedSearchResults from '../shared/transform.service';
import { getPublisherPlaylists } from '../user/publisher/publisher.get.service';
import getPlaylist from './playlist.get.service';

// const log = logger(path.relative(process.cwd(), __filename));

export async function getOtherPlaylistResults(
  playlistId: string,
  queryParams: ParsedQs,
): Promise<FSSearchTransformResponse> {
  const playlist: PlayListResponse = (await getPlaylist(playlistId)) as PlayListResponse;
  const { id } = playlist.owner;
  if (id) {
    const resultsFromES = await getPublisherPlaylists(id, queryParams);
    let { items } = resultsFromES;
    items = items.filter((e: FSSearchDOCSourceResponse): boolean => {
      const element = e as PlayListResponse;
      return !!(element.number_of_library_items && element.number_of_library_items > 2) && element.id !== playlistId;
    });
    return Promise.resolve({ total: resultsFromES.total, items });
  }
  return Promise.resolve({ total: 0, items: [] });
}

export async function otherPlaylists(
  playlistId: string,
  queryParams: ParsedQs,
): Promise<ResponseWrapperModel<UnifiedSearchResponse>> {
  const resultsFromFS = await getOtherPlaylistResults(playlistId, queryParams);
  return { total: resultsFromFS.total, items: transformToUnifiedSearchResults(resultsFromFS.items) };
}
