// import path from 'path';
import { ParsedQs } from 'qs';
import { ESDefaultClient } from '../../helper/axios.helper';
import { LibraryItemResponse, LIBRARY_ITEM_REVIEW_SUMMARY_FIELDS } from '../../model/library-item/library-item.model';
import { ESSearchDOCSourceResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Collection, ESIndex, SearchResultType } from '../../shared/enum';
// import logger from '../../shared/logger';
import { numberOrDefault } from '../../utils/query-parameter-parser';
import { getDocumentByIDFromES } from '../shared/elastic.service';
import { getFirestoreDocById, getFirestoreDocuments } from '../shared/firestore.service';
import { getPublisher } from '../user/publisher/publisher.get.service';

// const log = logger(path.relative(process.cwd(), __filename));

export async function getLibraryItem(
  id: string,
  summaryFields?: string[],
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getDocumentByIDFromES(id, ESIndex.LIBRARY_ITEM, ESDefaultClient, summaryFields).catch(
    async (): Promise<FirebaseFirestore.DocumentData> => {
      return getFirestoreDocById(Collection.LIBRARY_ITEMS, id, summaryFields);
    },
  );
}

export async function getLibraryItemReviews(id: string, queryParams: ParsedQs): Promise<FSSearchTransformResponse> {
  const offset: number = numberOrDefault(queryParams.offset || queryParams.from, 0);
  const limit: number = numberOrDefault(queryParams.limit || queryParams.size, DEFAULT_PAGE_SIZE);
  const libraryItem = await getLibraryItem(id);
  const conditionsForSearch: FSSearchCondition[] = [];
  const conditionsForSort: FSSortCondition[] = [];
  const fieldMasks: string[] = LIBRARY_ITEM_REVIEW_SUMMARY_FIELDS;
  return getFirestoreDocuments(
    `${Collection.LIBRARY_ITEMS}/${libraryItem.id}/reviews`,
    conditionsForSearch,
    conditionsForSort,
    offset || 0,
    limit || 20,
    fieldMasks,
    SearchResultType.LIBRARY_ITEM_REVIEWS,
  );
}

export async function getLibraryItemPublisherProfile(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  const libraryItem = (await getLibraryItem(id)) as LibraryItemResponse;
  return getPublisher(libraryItem.publisher.id);
}
