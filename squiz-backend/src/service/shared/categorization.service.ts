import * as esb from 'elastic-builder';
import * as lodash from 'lodash';
import { ParsedQs } from 'qs';
import { booleanOrDefault, csvStringToArray } from '../../utils/query-parameter-parser';

export default function filteringOptionsToESQueryArray(query: ParsedQs | undefined): esb.Query[] {
  const origins: string[] = csvStringToArray(query?.content_filters).map((e): string => e.trim().toLowerCase());
  const isScience = booleanOrDefault(query?.is_science, false);
  const isReligion = booleanOrDefault(query?.is_religion, false);
  const isSpirituality = booleanOrDefault(query?.is_spirituality, false);
  const isSecular = booleanOrDefault(query?.is_secular, false);
  const isNewage = booleanOrDefault(query?.is_newage, false); // "new age" is considered one word

  const queries = new Array<esb.Query>();
  if (isReligion) {
    queries.push(esb.termQuery('is_religion', isReligion));
  }
  if (isSpirituality) {
    queries.push(esb.termQuery('is_spirituality', isSpirituality));
  }
  if (isSecular) {
    queries.push(esb.termQuery('is_secular', isSecular));
  }
  if (isScience) {
    queries.push(esb.termQuery('is_science', isScience));
  }
  if (isNewage) {
    queries.push(esb.termQuery('is_newage', isNewage));
  }
  if (!lodash.isEmpty(origins)) {
    const categorizationQueries = [];
    if (origins.indexOf('newage') >= 0) {
      categorizationQueries.push(esb.termQuery('is_newage', true));
    }
    if (origins.indexOf('science') >= 0 || origins.indexOf('scientific') >= 0) {
      categorizationQueries.push(esb.termQuery('is_science', true));
    }
    if (origins.indexOf('secular') >= 0) {
      categorizationQueries.push(esb.termQuery('is_secular', true));
    }
    if (origins.indexOf('spirituality') >= 0 || origins.indexOf('spiritual') >= 0) {
      categorizationQueries.push(esb.termQuery('is_spirituality', true));
    }
    if (origins.indexOf('religion') >= 0 || origins.indexOf('religious') >= 0) {
      categorizationQueries.push(esb.termQuery('is_religion', true));
    }
    queries.push(esb.boolQuery().should(categorizationQueries).minimumShouldMatch(1));
  }
  return queries;
}
