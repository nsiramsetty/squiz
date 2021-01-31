import Axios from 'axios';
import { ApiResponse } from 'services/interface';
import { HOST_URL } from '../../Config/constants';

export const getTrendingHashtags = async (
  days?: number
): Promise<ApiResponse<string>> => {
  return Axios.get(
    `${HOST_URL}/apiHashtags/request/trending${(days && `?days=${days}`) || ''}`
  ).then(resp => {
    return {
      data: resp.data.result as [],
      total_count: parseInt(resp.headers['x-total-count'], 10)
    };
  });
};

const HashtagsApi = {
  getTrendingHashtags
};

export default HashtagsApi;
