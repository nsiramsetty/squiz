import { ResultSource, SearchResultType } from '../../shared/enum';

export interface FSSearchDOCSourceResponse {
  id: string;
  search_result_type: SearchResultType;
  item_type?: string;
  source?: ResultSource;
  is_publisher?: boolean;
  is_deleted?: boolean;
}

export interface FSSearchTransformResponse {
  total: number;
  items: FSSearchDOCSourceResponse[];
}

export interface FSSearchCondition {
  fieldPath: string;
  opStr: FirebaseFirestore.WhereFilterOp;
  value: string | boolean | number | string[];
}

export interface FSSortCondition {
  fieldPath: string;
  directionStr: FirebaseFirestore.OrderByDirection;
}
