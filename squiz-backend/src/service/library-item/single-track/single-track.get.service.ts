// import path from 'path';
import { ParsedQs } from 'qs';
import { SINGLE_TRACK_SUMMARY_FIELDS } from '../../../model/library-item/library-item.model';
import { ESSearchDOCSourceResponse } from '../../../model/shared/elastic.model';
import { FSSearchTransformResponse } from '../../../model/shared/firestore.model';
// import logger from '../../../shared/logger';
import { getLibraryItem, getLibraryItemPublisherProfile, getLibraryItemReviews } from '../library-item.get.service';

// const log = logger(path.relative(process.cwd(), __filename));

export default async function getSingleTrack(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getLibraryItem(id, SINGLE_TRACK_SUMMARY_FIELDS);
}

export async function getSingleTrackReviews(id: string, queryParams: ParsedQs): Promise<FSSearchTransformResponse> {
  return getLibraryItemReviews(id, queryParams);
}

export async function getSingleTrackPublisherProfile(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getLibraryItemPublisherProfile(id);
}
