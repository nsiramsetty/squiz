import Axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { HOST_URL, WEB_HOST } from '../../Config/constants.js';

/**
 * @returns {
 *  five_star_reviews: 150000
 *  free_guided_meditations: 15000
 *  meditators: 6200000
 *  meditators_now: 12584
 *  meditators_today: 555469
 *  teachers: 3000
 *  timestamp: 1558415900660
 * }
 */
export const getGlobalStats = () => {
  return Axios.get(`${HOST_URL}/apiAdminGlobalStats/request/stats`).then(
    resp => {
      return resp.data;
    }
  );
};

/**
 * @returns {
 *  result: {
 *    number_of_topics: 159,
 *    topic_groups: [{
 *      name: 'Popular',
 *      topics: [{..}]
 *    },{
 *      name: 'BENEFITS',
 *      topics: [{..}]
 *    },{
 *      name: 'PRACTICES',
 *      topics: [{..}]
 *    },{
 *      name: 'ORIGINS',
 *      topics: [{..}]
 *    }]
 *  }
 * }
 */
export const getTopicBrowse = () => {
  return Axios.get(
    `${HOST_URL}/apiTopicBrowse/request?content_langs=en&device_lang=en`
  )
    .then(resp => {
      return resp;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

/**
 * Track Session : logged in users
 */
export const trackUserSession = (
  userId: string,
  durationInSec: number,
  libraryItemId?: string
) => {
  const now = moment();
  return Axios.post(
    `${WEB_HOST}/apiTopicBrowse/request?content_langs=en&device_lang=en`,
    {
      type: 's',
      sv: 1,
      revision: 0,
      r1: userId,
      payload: [
        {
          status: 'none',
          localId: '1',
          data: {
            activity: 'Guided Meditation', // TODO for course ?
            duration: durationInSec,
            flags: 'I',
            local_date: [
              now.year(),
              now.month(),
              now.day(),
              now.hour(),
              now.minute(),
              now.second(),
              now.millisecond()
            ],
            preset: 'P1',
            media_ref: libraryItemId
          }
        }
      ]
    }
  )
    .then(resp => {
      return resp;
    })
    .catch(err => {
      console.warn(err);
    });
};

/**
 * Track Session : Anonymous users
 */
export const trackAnonymousSession = (
  durationInSec: number,
  libraryItemId?: string
) => {
  let anonymousId: any = localStorage.getItem('anonymous_id') || undefined;

  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem('anonymous_id', anonymousId);
  }

  return Axios.post(`${HOST_URL}/apiWebSessions/request`, {
    id: anonymousId,
    duration: durationInSec,
    library_item_id: libraryItemId
  })
    .then(resp => {
      return resp;
    })
    .catch(err => {
      console.warn(err);
    });
};
