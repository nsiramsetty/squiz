// import path from 'path';
import { ParsedQs } from 'qs';
import { COURSE_DAY_SUMMARY_FIELDS, COURSE_SUMMARY_FIELDS } from '../../../model/library-item/library-item.model';
import { ESSearchDOCSourceResponse } from '../../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../../model/shared/firestore.model';
import { Collection, SearchResultType } from '../../../shared/enum';
// import logger from '../../../shared/logger';
import { getFirestoreDocuments } from '../../shared/firestore.service';
import { getLibraryItem, getLibraryItemPublisherProfile, getLibraryItemReviews } from '../library-item.get.service';

// const log = logger(path.relative(process.cwd(), __filename));

export async function getCourse(id: string): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getLibraryItem(id, COURSE_SUMMARY_FIELDS);
}

export async function getCoursePublisherProfile(
  id: string,
): Promise<FirebaseFirestore.DocumentData | ESSearchDOCSourceResponse> {
  return getLibraryItemPublisherProfile(id);
}

export async function getCourseReviews(id: string, queryParams: ParsedQs): Promise<FSSearchTransformResponse> {
  return getLibraryItemReviews(id, queryParams);
}

export async function getCourseDays(id: string): Promise<FSSearchTransformResponse> {
  const course = await getLibraryItem(id, COURSE_SUMMARY_FIELDS);
  const conditionsForSearch: FSSearchCondition[] = [];
  const conditionsForSort: FSSortCondition[] = [];
  const offset = 0;
  const limit = 20;
  const fieldMasks: string[] = COURSE_DAY_SUMMARY_FIELDS;
  return getFirestoreDocuments(
    `${Collection.LIBRARY_ITEMS}/${course.id}/course_days`,
    conditionsForSearch,
    conditionsForSort,
    offset,
    limit,
    fieldMasks,
    SearchResultType.COURSE_DAYS,
  );
}
