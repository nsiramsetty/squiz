import Axios from 'axios';
import queryString from 'query-string';

export interface EventDate {
  start_date: {
    epoch: number;
    iso_8601_datetime_tz: string;
  };
  end_date: {
    epoch: number;
    iso_8601_datetime_tz: string;
  };
  has_ended: boolean;
}

interface ResponseItem {
  item_summary: {
    event_summary: Event;
  };
}

export interface Event {
  id: string;
  title: string;
  cover_image_id: string;
  event_curated_image_id: string;
  has_ended: boolean;
  number_of_attendees: number;
  description?: string;
  owner: {
    id: string;
    name: string;
    username: string;
  };
  _next_occurrences: EventDate[];
}

export interface Filter {
  content_types?: string;
  start_date_from?: number;
  start_date_to?: number;
  hashtags?: string;
}

const API_HOST = 'https://filtering.insighttimer-api.net';

export const getEventsByFilter = async (
  filters: Filter,
  offset: number,
  limit: number
) => {
  const queries = queryString.stringify(filters);
  const response = await Axios.get(
    `${API_HOST}/api/v1/events/filter?type=LIVE_STREAM&device_lang=en&occurrence_types=LIVE%2CFUTURE&include_private=false&include_pending=false&sort_option=start_date&sort_direction=asc&offset=${offset}&limit=${limit}&${queries}`
  );
  const { data } = response;
  return data as ResponseItem[];
};

export const getEventById = async (id: string) => {
  const response = await Axios.get(`${API_HOST}/api/v1/events/${id}`);
  const { data } = response;
  return data as Event;
};

export const searchEvents = async (
  query: string,
  offset: number,
  limit: number
) => {
  const response = await Axios.get(
    `${API_HOST}/api/v1/events/search?query=${query}&offset=${offset}&limit=${limit}`
  );
  const { data } = response;
  return data as ResponseItem[];
};
