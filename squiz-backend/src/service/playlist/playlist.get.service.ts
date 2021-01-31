// import path from 'path';
// import logger from '../../shared/logger';
import { ESDefaultClient } from '../../helper/axios.helper';
import { ESSearchDOCSourceResponse } from '../../model/shared/elastic.model';
import { Collection, ESIndex } from '../../shared/enum';
import { getDocumentByIDFromES } from '../shared/elastic.service';
import { getFirestoreDocById } from '../shared/firestore.service';

// const log = logger(path.relative(process.cwd(), __filename));

export default async function getPlaylist(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getDocumentByIDFromES(id, ESIndex.PLAYLIST, ESDefaultClient).catch(
    async (): Promise<FirebaseFirestore.DocumentData> => {
      return getFirestoreDocById(Collection.PLAYLISTS, id);
    },
  );
}
