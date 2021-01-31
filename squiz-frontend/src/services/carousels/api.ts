import Axios from 'axios';
import get from 'lodash/get';
import queryString from 'query-string';
import { ApiResponse, LooseObject } from 'services/interface';
import {
  convert as convertLibrary,
  convertFeaturedList
} from 'services/libraryItem/api';
import { LibraryItem } from 'services/libraryItem/interface';
import {
  convert as convertPublisher,
  convertFeaturedPublishers as convertFeaturedPublisher
} from 'services/publisher/api';
import { Publisher } from 'services/publisher/interface';
import { HOST_URL } from '../../Config/constants';
import { CarouselService } from './interface';

export class CarouselApi implements CarouselService {
  getLibraryItems(
    query: LooseObject,
    limit: number,
    from?: number
  ): Promise<ApiResponse<LibraryItem>> {
    return Axios.get(
      `${HOST_URL}/apiLibraryItemFilter/request?${`limit=${limit ||
        10}&from=${from || 0}&`}${queryString.stringify(query)}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convertLibrary(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getLibraryItemsForSearch(
    query: string,
    limit: number,
    from?: number
  ): Promise<ApiResponse<LibraryItem>> {
    // return Axios.get(`${HOST_URL}/apiLibraryItemFilter/request?${`limit=${limit || 10}&from=${from || 0}&`}${queryString.stringify(query)}`)
    const url = `${HOST_URL}/apiUnifiedSearch/audio/request?query=${query}&limit=${limit ||
      10}&offset=${from || 0}&device_lang=en&content_langs=en`;
    return Axios.get(url).then(resp => {
      return {
        data: resp.data,
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getCourses(
    query: LooseObject,
    limit: number,
    from?: number
  ): Promise<ApiResponse<LibraryItem>> {
    return Axios.get(
      `${HOST_URL}/apiLibraryItemFilter/request/courses?${`limit=${limit ||
        10}&from=${from || 0}&`}${queryString.stringify(query)}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convertLibrary(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getFeaturedLibraryItems(entry_point: string, lang?: string) {
    return Axios.get(
      `${HOST_URL}/apiAsFrontEndFeaturedList/v2/request/summary?${`entry_point=${entry_point}`}&device_lang=${lang ||
        'en'}&content_langs=${lang || 'en'}
      `
    ).then(resp => {
      return {
        data: (resp.data.items as [])
          .filter(o => get(o, 'featured_list_item_type') === 'LIBRARY_ITEMS')
          .map(o => convertFeaturedList(o, true)),
        name: resp.data.name,
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getFeaturedPublishers(
    entry_point: string,
    lang?: string,
    content_types?: string
  ) {
    return Axios.get(
      `${HOST_URL}/apiAsFrontEndFeaturedList/v2/request/summary?${`entry_point=${entry_point}`}&device_lang=${lang ||
        'en'}&content_langs=${lang || 'en'}`
    )
      .then(resp => {
        return {
          data: (resp.data.items as [])
            .filter(o => get(o, 'featured_list_item_type') === 'USERS')
            .map(o => convertFeaturedPublisher(o)),
          name: resp.data.name,
          total_count: parseInt(resp.headers['x-total-count'], 10)
        };
      })
      .catch(err => {
        console.log(err);
        return {
          data: [],
          name: '',
          total_count: 0
        };
      });
  }

  getPublishers(
    query: LooseObject,
    size: number,
    from?: number
  ): Promise<ApiResponse<Publisher>> {
    return Axios.get(
      `${HOST_URL}/apiPublisherSearch/request?${`size=${size ||
        10}&from=${from || 0}&`}${queryString.stringify(query)}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convertPublisher(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }
}
