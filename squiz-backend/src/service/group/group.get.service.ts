// import path from 'path';
import { ESDefaultClient } from '../../helper/axios.helper';
import { ESSearchDOCSourceResponse } from '../../model/shared/elastic.model';
import { Collection, ESIndex } from '../../shared/enum';
// import logger from '../../shared/logger';
import { getDocumentByIDFromES } from '../shared/elastic.service';
import { getFirestoreDocById } from '../shared/firestore.service';

// const log = logger(path.relative(process.cwd(), __filename));
export default async function getGroup(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getDocumentByIDFromES(id, ESIndex.GROUP, ESDefaultClient).catch(
    async (): Promise<FirebaseFirestore.DocumentData> => {
      return getFirestoreDocById(Collection.GROUPS, id);
    },
  );
}
