import Axios from 'axios';
import { LooseObject } from 'lib/models';

const API_HOST = 'https://search.insighttimer-api.net';
const SearchWhitelist = ['USERS', 'LIBRARY_ITEMS', 'COURSES', 'HASHTAGS'];

export const topSearch = async (
  query: string,
  limit: number = 10,
  from: number = 0,
  deviceLang: string = 'en'
): Promise<LooseObject[]> => {
  const response = await Axios.get(
    `${API_HOST}/api/v1/top?query=${query}&limit=${limit}&offset=${from}&device_lang=${deviceLang}&publishers_only_users=true`
  );
  const { data } = response;

  const result = data
    .filter((r: LooseObject) => {
      return SearchWhitelist.includes(r.item_summary.type);
    })
    .map((r: LooseObject) => {
      if (r.item_summary.hashtag_summary != null)
        return r.item_summary.hashtag_summary;

      if (r.item_summary.user_summary != null)
        return r.item_summary.user_summary;

      if (r.item_summary.library_item_summary != null)
        return r.item_summary.library_item_summary;

      return null;
    });

  return result;
};

export const singleTrackSearch = async (
  query: string,
  limit: number = 10,
  from: number = 0,
  deviceLang: string = 'en'
): Promise<any> => {
  const response = await Axios.get(
    `${API_HOST}/api/v1/single-tracks/search?query=${query}&limit=${limit}&offset=${from}&device_lang=${deviceLang}`
  );
  const { data } = response;

  const result = data
    .filter((r: LooseObject) => {
      return r.item_summary.type === 'LIBRARY_ITEMS';
    })
    .map((r: LooseObject) => {
      if (r.item_summary.library_item_summary != null)
        return r.item_summary.library_item_summary;

      return null;
    });

  return result;
};
