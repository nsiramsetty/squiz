import Axios from 'axios';
import { HOST_URL } from 'Config/constants';
import { Course, UserSummary } from 'services/courses';
import { Event } from 'services/events';
import { LibraryItem } from 'services/singles';

interface EventResponseItem {
  event_summary: Event;
}

export interface FeaturedItem {
  description?: string;
  featured_list_item_type: 'LIBRARY_ITEMS' | 'USERS' | 'PLAYLISTS';
  library_item_summary?: Course | LibraryItem;
  user_summary?: UserSummary;
}

const FEATURED_LIVE_EVENT_API_BASEURL = `${HOST_URL}/apiAsFrontEndFeaturedList/v2/request/summary`;

export const getFeaturedLiveEvents = async (
  entry_point: string,
  lang?: string
) => {
  try {
    const response = await Axios.get(
      `${FEATURED_LIVE_EVENT_API_BASEURL}?entry_point=${entry_point}&device_lang=${lang ||
        'en'}&content_langs=${lang || 'en'}`
    );
    const featureEventList: EventResponseItem[] = response.data.items;
    return featureEventList;
  } catch (e) {
    throw e.response.data.message;
  }
};

export const getFeaturedList = async (
  entry_point: string,
  language: string
) => {
  const response = await Axios.get(
    `${FEATURED_LIVE_EVENT_API_BASEURL}?entry_point=${entry_point}&device_lang=${language}&content_langs=${language}`
  );

  const { data } = response;
  const results: FeaturedItem[] = data.items?.filter(
    (i: FeaturedItem) => i.featured_list_item_type !== 'PLAYLISTS'
  );

  return {
    results,
    name: data.name
  };
};
