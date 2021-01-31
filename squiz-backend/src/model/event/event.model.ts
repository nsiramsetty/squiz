import { SearchResultResponse } from '../response/search-result.model';

export const EVENT_SUMMARY_FIELDS = [
  '_next_occurrences',
  'description',
  'hashtags',
  'id',
  'lang',
  'number_of_attendees',
  'owner',
  'privacy',
  'status',
  'title',
  'type',
  'version',
  'event_curated_image_id',
];

export const EVENT_SUMMARY_TOP_VIEW_FIELDS = [
  '_next_occurrences',
  'description',
  'id',
  'lang',
  'number_of_attendees',
  'owner',
  'privacy',
  'status',
  'title',
  'type',
  'version',
  'event_curated_image_id',
];

export const OCCURRENCE_SUMMARY_FIELDS = [
  'broadcast_summary',
  'circle_emoji',
  'description',
  'end_date',
  'id',
  'is_commenting_enabled',
  'owner_id',
  'start_date',
  'title',
  'type',
];

export interface EventResponse extends SearchResultResponse {
  title: string;
  _next_occurrences: EventOccurrence[];
}

export interface EventOccurrence extends SearchResultResponse {
  title: string | undefined;
}

export interface EventDifferenceResponse {
  firestoreOnlyEvents: string[];
  totalFirestoreOnlyEvents: number;
  elasticOnlyEvents: string[];
  totalElasticOnlyEvents: number;
  totalElasticEvents: number;
  totalFirestoreEvents: number;
}

export const EventContentFilterMapping: { [unit: string]: string[] } = {
  science: ['parentscience', 'neuroscience', 'psychology', 'sciencemedicine', 'sportscience'],
  newage: ['newage', 'metaphysics', 'newagemysticism', 'astrology'],
  secular: ['secular', 'naturalenvironment', 'secularmindfulness'],
  religion: [
    'religion',
    'bahaifaith',
    'bhaktimovement',
    'christianity',
    'confucianism',
    'hinduism',
    'islam',
    'jainism',
    'judaism',
    'shinto',
    'sikhism',
    'sufism',
    'taoism',
    'traditionalbuddhism',
  ],
  spirituality: [
    'parentspirituality',
    'consciousness',
    'spirituality',
    'contemporarybuddhism',
    'nonduality',
    'energybased',
    'vedictradition',
    'alternativemedicine',
    'shamanism',
    'kabbalah',
    'yogalibrary_item.hashtags.13001.name_in_app',
  ],
};
