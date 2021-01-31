/* eslint-disable class-methods-use-this */
import Axios from 'axios';
import { LooseObject } from 'lib/models';
import { ApiResponse } from 'services/interface';
import { HOST_URL } from '../../Config/constants';
import { SearchService } from './interface';
export interface SearchResponse {
  data: LooseObject[];
  total_count: number;
}

export class SearchApi implements SearchService {
  async getSearchItems(
    query: string,
    limit: number = 10,
    from: number = 0,
    deviceLang: string = 'en'
  ): Promise<ApiResponse<SearchResponse>> {
    const url = `${HOST_URL}/apiUnifiedSearch/top/request?query=${query}&limit=${limit}&offset=${from}&device_lang=${deviceLang}&publishers_only_users=true`;

    const resp = await Axios.get(url);
    return {
      data: resp.data,
      total_count: parseInt(resp.headers['x-total-count'], 10)
    };
  }
}
