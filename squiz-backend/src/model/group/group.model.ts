import { SearchResultResponse } from '../response/search-result.model';
import { FSSearchDOCSourceResponse } from '../shared/firestore.model';

export interface GroupResponse extends SearchResultResponse {
  language?: {
    iso_639_1?: string;
    name?: string;
  };
  long_description?: string;
  member_count?: number;
  name?: string;
  short_description?: string;
  friends?: string[];
  is_member?: boolean;
}

export const GROUP_SUMMARY_FIELDS = [
  'id',
  'admins.name',
  'admins.id',
  'created_at',
  'created_by',
  'created_by_device_lang',
  'name',
  'long_description',
  'type',
  'member_count',
  'privacy_type',
  'privacy_hidden',
  'welcome_message',
  'updated_at',
  'updated_by',
  'background',
  'is_deleted',
  'email_domains',
];

export const GROUP_SUMMARY_TOP_VIEW_FIELDS = ['id', 'background', 'name', 'type', 'privacy_type', 'member_count'];

export const GROUP_RELATION_SUMMARY_FIELDS = ['group_summary', 'has_joined', 'joined_at', 'is_private'];

export interface GrouptDifferenceResponse {
  firestoreOnlyGroups: string[];
  totalFirestoreOnlyGroups: number;
  totalFirestoreGroups: number;
  elasticOnlyGroups: string[];
  totalElasticOnlyGroups: number;
  totalElasticGroups: number;
}

export interface WorkplaceEmail extends FSSearchDOCSourceResponse {
  email_id: string;
  is_deleted: boolean;
  is_verified: boolean;
}
