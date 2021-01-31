import Axios from 'axios';
import queryString from 'query-string';
import { ApiResponse } from 'services/interface';
import { HOST_URL } from '../../Config/constants';
import { Publisher, PublisherService, TSortOption } from './interface';

interface LooseObject {
  [key: string]: any;
}
 
export function convert(obj: LooseObject): Publisher {
  return {
    id: obj.id,
    slug: obj.username,
    name: obj.name,
    description: obj.publisher_description,
    follower_count: obj.publisher_follower_count,
    avatar: obj.avatar && obj.avatar.large,
    play_count: obj.publisher_play_count,
    location: obj.region && obj.region.name,
    created_at: obj.created_at && obj.created_at.epoch
  } as Publisher;
}

export function convertFeaturedPublishers(obj: LooseObject): Publisher {
  return {
    id: obj.user_summary.id,
    slug: obj.user_summary.username,
    name: obj.user_summary.name,
    description: obj.description,
    follower_count: obj.publisher_follower_count,
    avatar: obj.avatar && obj.avatar.large,
    play_count: obj.publisher_play_count,
    location: obj.user_summary.region && obj.user_summary.region.name,
    created_at: obj.created_at && obj.created_at.epoch
  } as Publisher;
}

export class PublisherApi implements PublisherService {
  getPublisherById(id: string): Promise<Publisher> {
    return Axios.get(
      `${HOST_URL}/apiPublisherGet/request/publishers/${id}`
    ).then(resp => {
      return convert(resp.data);
    });
  }

  getPublisherBySlug(slug: string): Promise<Publisher> {
    return Axios.get(`${HOST_URL}/apiSlugGet/request/slugs/users/${slug}`).then(
      resp => {
        console.log('--publisherinfo --');
        console.log(resp.data);
        return convert(resp.data.ref_doc);
      }
    );
  }

  searchPublisherByIds(
    ids: string[],
    size: number,
    from?: number
  ): Promise<ApiResponse<Publisher>> {
    return Axios.get(
      `${HOST_URL}/apiPublisherSearch/request?ids=${ids.join(
        ','
      )}&size=${size}${(from && `&from=${from}`) || ''}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convert(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  searchPublishers(
    sort_option: TSortOption,
    size: number,
    from: number,
    query: LooseObject,
    startWith?: string
    // query?: string
  ): Promise<ApiResponse<Publisher>> {
    return Axios.get(
      startWith && startWith !== ''
        ? `${`${HOST_URL}/apiPublisherSearch/request?` +
            `starts_with=${`${startWith},${startWith.toUpperCase()}`}` +
            `&sort_option=${sort_option}&size=${size}`}${(from &&
            `&from=${from}`) ||
            ''}&${queryString.stringify(query)}`
        : `${HOST_URL}/apiPublisherSearch/request?sort_option=${sort_option}&size=${size}${(from &&
            `&from=${from}`) ||
            ''}&${queryString.stringify(query)}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convert(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  headPublishers(): Promise<number> {
    return Axios.head(`${HOST_URL}/apiPublisherSearch/request?`).then(resp =>
      parseInt(resp.headers['x-total-count'], 10)
    );
  }

  getPublishersByLocation(
    lat: string,
    long: string,
    from: any,
    size: number
  ): Promise<ApiResponse<Publisher>> {
    return Axios.get(
      `${HOST_URL}/apiPublisherSearch/request?geo_pin=${lat},${long}&geo_distance=50km&sort_option=popular&from=${from}&size=${size}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convert(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }
}
