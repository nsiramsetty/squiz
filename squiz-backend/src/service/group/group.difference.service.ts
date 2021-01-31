import * as builder from 'elastic-builder';
import * as lodash from 'lodash';
// import path from 'path';
import { GrouptDifferenceResponse } from '../../model/group/group.model';
import { ESSearchTransformResponse } from '../../model/shared/elastic.model';
import { FSSearchCondition, FSSearchTransformResponse, FSSortCondition } from '../../model/shared/firestore.model';
import { Collection, ESIndex, FSWhereOperator, GroupType } from '../../shared/enum';
// import logger from '../../shared/logger';
import { getSingleIndexResultsFromES } from '../shared/elastic.service';
import { getFirestoreDocuments } from '../shared/firestore.service';

// const log = logger(path.relative(process.cwd(), __filename));

const MAX_LIMIT = 10000;

function comparer(arrayOne: string[], arrayTwo: string[]): string[] {
  return lodash.difference(arrayOne, arrayTwo);
}

export function getGroupESQuery(): builder.RequestBodySearch {
  const queries: builder.Query[] = [];
  const reqBody: builder.RequestBodySearch = builder.requestBodySearch().from(0).size(MAX_LIMIT).source(['id']);
  queries.push(builder.boolQuery().mustNot(builder.matchQuery('type.keyword', GroupType.LEGACY)));
  queries.push(
    builder
      .boolQuery()
      .should([
        builder.matchQuery('type.keyword', GroupType.GROUP),
        builder.matchQuery('type.keyword', GroupType.ENTERPRISE),
      ])
      .minimumShouldMatch(1),
  );
  return reqBody.query(builder.boolQuery().must(queries));
}

export async function getGroupsResultsFromES(): Promise<ESSearchTransformResponse> {
  const esQuery = getGroupESQuery();
  return getSingleIndexResultsFromES(ESIndex.GROUP, esQuery);
}

export async function getGroupsResultsFromFS(): Promise<FSSearchTransformResponse> {
  const conditionsForSearch: FSSearchCondition[] = [];
  conditionsForSearch.push({
    fieldPath: 'type',
    opStr: FSWhereOperator.IN,
    value: [GroupType.ENTERPRISE, GroupType.GROUP],
  });
  const fieldMasks: string[] = ['id'];
  const conditionsForSort: FSSortCondition[] = [];
  const offset = 0;
  const limit: number = MAX_LIMIT;
  return getFirestoreDocuments(Collection.EVENTS, conditionsForSearch, conditionsForSort, offset, limit, fieldMasks);
}

export async function differenceGroups(): Promise<GrouptDifferenceResponse> {
  const resultsFromES = await getGroupsResultsFromES();
  const esGroups = resultsFromES.items.map((e): string => e.id);
  const resultsFromFS = await getGroupsResultsFromFS();
  const fsGroups = resultsFromFS.items.map((e): string => e.id);
  const firestoreGroupsDiff = comparer(fsGroups, esGroups);
  const elasticGroupsDiff = comparer(esGroups, fsGroups);
  const groupDifference: GrouptDifferenceResponse = {
    elasticOnlyGroups: elasticGroupsDiff,
    firestoreOnlyGroups: firestoreGroupsDiff,
    totalElasticOnlyGroups: esGroups.length,
    totalFirestoreGroups: fsGroups.length,
    totalElasticGroups: elasticGroupsDiff.length,
    totalFirestoreOnlyGroups: firestoreGroupsDiff.length,
  };
  return groupDifference;
}
