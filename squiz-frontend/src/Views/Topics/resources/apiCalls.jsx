import axios from 'axios';
import find from 'lodash/find';
import * as data from '../../../Assets/JsonFiles/topics.json';
import { HOST_URL } from '../../../Config/constants';

/**
 * to get data of static topic page
 */
export const getAllTopics = () => {
  return axios
    .get(`${HOST_URL}/apiTopicBrowse/request?content_langs=en&device_lang=en`)
    .then(resp => {
      return resp.data;
    });
};

/**
 * to get data of topic's course array
 * @param {*} slug topic id
 */
export const searchCoursesById = ids => {
  return axios
    .get(
      `${HOST_URL}/apiCourseFilter/request?ids=${ids}&ignore_langs=true&sort_option=popular`
    )
    .then(resp => {
      return { array: resp.data.result, count: resp.headers['x-total-count'] };
    });
};

/**
 * to get data of topic's library items
 * @param {*} slug topic id
 */
export const searchLibraryItemsByTopics = slug => {
  return axios
    .get(
      `${HOST_URL}/apiLibraryItemFilter/request?topics=${slug}&ignore_langs=true&sort_option=popular&size=6&count_unique_publishers=true`
    )
    .then(resp => {
      return {
        array: resp.data.result.slice(0, 6),
        count: resp.headers['x-total-count'],
        publisher_count: resp.headers['x-publisher-count']
      };
    });
};

/**
 *
 * @param {*} slug topic name
 */
export const getTopicBySlug = slug => {
  return axios
    .get(
      `${HOST_URL}/apiTopicFetch/request/web?device_lang=en&topic=${slug}&content_langs=en`
    )
    .then(resp => {
      return resp.data;
    });
};

/**
 * to get data of publisher from id
 */
export const searchPublishersByIds = ids => {
  return axios
    .get(
      `${HOST_URL}/apiPublisherSearch/request?ids=${ids}&sort_option=popular`
    )
    .then(resp => {
      return { array: resp.data.result, count: resp.headers['x-total-count'] };
    });
};

/**
 * to get data of static topic page
 */
export const getStaticTopic = async topicName => {
  if (topicName === 'Music') {
    const responseData = find(data.default.result.topic_groups, {
      name: topicName
    });
    if (Array.isArray(responseData.topics)) {
      return responseData;
    }
    return undefined;
  }
  return axios
    .get(`${HOST_URL}/apiTopicBrowse/request?content_langs=en&device_lang=en`)
    .then(resp => {
      const responseData = find(resp.data.result.topic_groups, {
        name: topicName
      });
      return responseData;
    });
};

export const searchLibraryItems = (query, topic) => {
  const promises = [
    axios.get(`${HOST_URL}/apiLibraryItemFilter/request${query}`)
  ];

  if (topic)
    promises.push(
      axios.get(
        `${HOST_URL}/apiTopicFetch/request?device_lang=en${
          topic ? `&topic=${topic}` : ''
        }`
      )
    );

  return Promise.all(promises).then(res => {
    return {
      array: res[0].data.result,
      total_count: parseInt(res[0].headers['x-total-count'], 10),
      topic_data: res.length > 1 && res[1].data
    };
  });
};
