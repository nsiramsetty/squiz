import Axios from 'axios';
import queryString from 'query-string';
import { ApiResponse } from 'services/interface';
import { HOST_URL } from '../../Config/constants';
import {
  Course,
  Filter,
  LibraryItem,
  LibraryItemService,
  Review,
  TSortOption
} from './interface';

interface LooseObject {
  [key: string]: any;
}

export function convert(obj: LooseObject, featuredList?: boolean): LibraryItem {
  return {
    type: obj.media_length ? 'SINGLE' : 'COURSE',
    slug: obj.slug,
    id: obj.id,
    title: obj.title,
    description: obj.long_description,
    duration_minutes:
      obj.media_length > 59
        ? Math.floor(obj.media_length / 60)
        : obj.media_length,
    duration_days: obj.days, //*
    rating: obj.rating_score,
    rating_count: obj.rating_count,
    play_count: obj.play_count,
    created_at: obj.created_at && obj.created_at.epoch,
    publisher_name: obj.publisher && obj.publisher.name,
    publisher_username: obj.publisher && obj.publisher.username,
    publisher_id: obj.publisher && obj.publisher.id,
    publisher_location:
      obj.publisher && obj.publisher.region && obj.publisher.region.name,
    publisher_avatar:
      obj.publisher &&
      `${process.env.REACT_APP_PUBLISHER_IMAGE}/${obj.publisher.id}%2Fpictures%2Fsquare_small.jpeg?alt=media`,
    background_image:
      !featuredList &&
      (obj.picture_rectangle
        ? obj.picture_rectangle.medium
        : obj.picture.medium),
    student_count: obj.number_of_students,
    topics: obj.topics,
    web_url: obj.web_url,
    content_type: obj.content_type,
    purchase_tier: obj.purchase_tier,
    level: obj.level,
    brand_hex_color: obj.brand_hex_color,
    media_length_sec: obj.media_length
  } as LibraryItem;
}

export function convertFeaturedList(
  obj: LooseObject,
  featuredList?: boolean
): LibraryItem {
  return {
    type:
      obj.library_item_summary.item_type &&
      obj.library_item_summary.item_type === 'SINGLE_TRACKS'
        ? 'SINGLE'
        : 'COURSE',
    slug: obj.library_item_summary.slug,
    id: obj.library_item_summary.id,
    title: obj.library_item_summary.title,
    description: obj.description,
    duration_minutes: obj.library_item_summary.media_length
      ? Math.ceil(obj.library_item_summary.media_length / 60)
      : 0,
    media_length_sec: obj.library_item_summary.media_length,
    duration_days:
      obj.library_item_summary.days && obj.library_item_summary.days, //*
    rating: obj.library_item_summary.rating_score,
    rating_count: obj.library_item_summary.rating_count,
    play_count: obj.play_count,
    created_at: obj.created_at && obj.created_at.epoch,
    publisher_name:
      obj.library_item_summary.publisher &&
      obj.library_item_summary.publisher.name,
    publisher_id:
      obj.library_item_summary.publisher &&
      obj.library_item_summary.publisher.id,
    publisher_username:
      (obj.library_item_summary &&
        obj.library_item_summary.publisher?.username) ||
      (obj.library_item_summary.web_url &&
        obj.library_item_summary.web_url.split('/')[1]),
    student_count: obj.number_of_students,
    topics: obj.topics,
    web_url: obj.library_item_summary.web_url,
    content_type: obj.library_item_summary.content_type,
    purchase_tier: obj.library_item_summary.purchase_tier,
    level: obj.level,
    brand_hex_color: obj.brand_hex_color
  } as LibraryItem;
}

export function convertCourse(obj: LooseObject): Course {
  const course: Course = convert(obj) as Course;

  course.media_paths_audio_intro = obj.media_paths_audio_intro;
  course.course_days = obj.course_days;

  return course;
}

function queryFromFilter(filter: Filter): LooseObject {
  const query: LooseObject = {};
  if (filter) {
    query.ids = filter && filter.ids;
    query.content_types = filter && filter.filterType;
    query.length_range =
      filter && filter.filterLength && filter.filterLength.trim();
    query.voice_gender = filter && filter.filterVoice;
    query.is_religious = filter.hideReligious ? false : undefined;
    query.is_spiritual = filter.hideSpiritual ? false : undefined;
    query.has_background_music = filter.backgroundMusic;
    query.content_langs = filter.contentLangs?.split(',');
    query.device_lang = filter.deviceLang;
  }
  return query;
}

export class LibraryItemApi implements LibraryItemService {
  getLibraryItemsByFilter(
    filter: Filter,
    sortOption: TSortOption,
    limit: number,
    offset: number,
    topic?: string
  ): Promise<ApiResponse<LibraryItem>> {
    const query: LooseObject = queryFromFilter(filter);

    query.topics = topic;
    query.sort_option = sortOption;
    query.size = limit;
    query.offset = offset;

    return Axios.get(
      `${HOST_URL}/apiLibraryItemFilter/request?${queryString.stringify(query, {
        arrayFormat: 'comma'
      })}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convert(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  headLibraryItemsByFilter(
    filter: Filter,
    sortOption: TSortOption,
    limit: number,
    offset: number,
    topic?: string
  ): Promise<ApiResponse<LibraryItem>> {
    const query: LooseObject = queryFromFilter(filter);

    query.topics = topic;
    query.sort_option = sortOption;
    query.limit = limit;
    query.offset = offset;

    return Axios.head(
      `${HOST_URL}/apiLibraryItemFilter/request?ignore_langs=true&${queryString.stringify(
        query
      )}`
    ).then(resp => {
      return {
        data: [],
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getLibraryItemsByPublisher(
    publisher_id: string,
    sort_option: TSortOption,
    limit: number,
    offset: number
  ): Promise<ApiResponse<LibraryItem>> {
    return Axios.get(
      `${HOST_URL}/apiLibraryItemFilter/request?publisher_id=${publisher_id}&sort_option=${sort_option}&limit=${limit ||
        10}&offset=${offset || 0}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convert(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getCoursesByPublisher(
    publisher_id: string,
    sort_option: TSortOption,
    limit: number,
    offset: number
  ): Promise<ApiResponse<LibraryItem>> {
    return Axios.get(
      `${HOST_URL}/apiLibraryItemFilter/request/courses?ignore_langs=true&publisher_ids=${publisher_id}&sort_option=${sort_option}&limit=${limit ||
        10}&offset=${offset || 0}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convert(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getCoursesByFilter(
    filterObj: Filter,
    sort_option: TSortOption,
    limit: number,
    offset: number,
    filter?: string,
    topic?: string
  ): Promise<ApiResponse<LibraryItem>> {
    const query: LooseObject = queryFromFilter(filterObj);

    query.filter = filter;
    query.sort_option = sort_option;
    query.limit = limit;
    query.offset = offset;
    query.topics = topic;

    return Axios.get(
      `${HOST_URL}/apiLibraryItemFilter/request/courses?${queryString.stringify(
        query
      )}`
    ).then(resp => {
      return {
        data: (resp.data.result as []).map(o => convert(o)),
        total_count: parseInt(resp.headers['x-total-count'], 10)
      };
    });
  }

  getCourseBySlug(slug: string): Promise<Course> {
    return Axios.get(
      `${HOST_URL}/apiSlugGet/request/slugs/courses/${slug}`
    ).then(resp => {
      return convertCourse(resp.data.ref_doc);
    });
  }

  getLibraryItemBySlug(slug: string): Promise<LibraryItem> {
    return Axios.get(
      `${HOST_URL}/apiSlugGet/request/slugs/libraryitems/${slug}`
    ).then(resp => {
      return convert(resp.data.ref_doc);
    });
  }

  getLibraryItemById(id: string): Promise<LibraryItem> {
    return Axios.get(
      `${HOST_URL}/apiLibraryItemGet/request/libraryitems/${id}`
    ).then(resp => {
      return convert(resp.data);
    });
  }

  getReviewsById(id: string, limit: number, offset: number): Promise<Review[]> {
    return Axios.get(
      `${HOST_URL}/apiLibraryItemReviewsByItemId/request?id=${id}&offset=${offset}&limit=${limit}`
    ).then(resp => {
      return (resp.data.result as []).map((o: any) => {
        return {
          ...o,
          avatar: `${process.env.REACT_APP_PUBLISHER_IMAGE}/${o.owner.id}%2Fpictures%2Fsquare_medium.jpeg?alt=media`,
          author: o.owner.name,
          created_at: o.created_at.epoch
        };
      });
    });
  }
}
