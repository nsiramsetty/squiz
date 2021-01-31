// import path from 'path';
import { ESDefaultClient } from '../../helper/axios.helper';
import { EVENT_SUMMARY_FIELDS } from '../../model/event/event.model';
import { ESSearchDOCSourceResponse } from '../../model/shared/elastic.model';
import { Collection, ESIndex } from '../../shared/enum';
// import logger from '../../shared/logger';
import { getDocumentByIDFromES } from '../shared/elastic.service';
import { getFirestoreDocById } from '../shared/firestore.service';
// const log = logger(path.relative(process.cwd(), __filename));

export default async function getEvent(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getDocumentByIDFromES(id, ESIndex.EVENT, ESDefaultClient, EVENT_SUMMARY_FIELDS).catch(
    async (): Promise<FirebaseFirestore.DocumentData> => {
      return getFirestoreDocById(Collection.EVENTS, id, EVENT_SUMMARY_FIELDS);
    },
  );
}
