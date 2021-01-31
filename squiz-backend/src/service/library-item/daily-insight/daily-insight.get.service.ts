// import path from 'path';
import { ParsedQs } from 'qs';
import { DAILY_INSIGHT_ITEM_SUMMARY_FIELDS } from '../../../model/library-item/library-item.model';
import { ESSearchDOCSourceResponse } from '../../../model/shared/elastic.model';
import { FSSearchTransformResponse } from '../../../model/shared/firestore.model';
// import logger from '../../../shared/logger';
import { getLibraryItem, getLibraryItemPublisherProfile, getLibraryItemReviews } from '../library-item.get.service';

// const log = logger(path.relative(process.cwd(), __filename));

export default async function getDailyInsightById(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getLibraryItem(id, DAILY_INSIGHT_ITEM_SUMMARY_FIELDS);
}

export async function getDailyInsightPublisherProfile(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getLibraryItemPublisherProfile(id);
}

export async function getDailyInsightReviews(id: string, queryParams: ParsedQs): Promise<FSSearchTransformResponse> {
  return getLibraryItemReviews(id, queryParams);
}
