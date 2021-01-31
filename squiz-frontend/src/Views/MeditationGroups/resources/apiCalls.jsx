import axios from 'axios';
import { HOST_URL } from '../../../Config/constants';

export const getGroups = (page = 0) => {
  return axios
    .get(
      `${HOST_URL}/apiGroupFilter/request?from=${page}&size=24&sort_option=most_members`
    )
    .then(resp => {
      const total_count = parseInt(resp.headers['x-total-count']);
      return {
        array: resp.data.result,
        total_count
      };
    });
};

export const getGroupSlugData = async (slug = '') => {
  const data = {
    hashtags: [],
    id:
      'F6x8a4J8m1v3j1p1M1E4e4d8a5f7k8r7h5f0s8a0W3M6p4r3K6T6a8s4L8G3M7Q7D5L3Y0R9N4A6v0N5',
    image: {
      large:
        'https://s3-us-west-2.amazonaws.com/com-insighttimer-dev-static-s3/group_data/pictures/5946/large/logo1.png',
      medium:
        'https://s3-us-west-2.amazonaws.com/com-insighttimer-dev-static-s3/group_data/pictures/5946/medium/logo1.png',
      small:
        'https://s3-us-west-2.amazonaws.com/com-insighttimer-dev-static-s3/group_data/pictures/5946/small/logo1.png'
    },
    language: { iso_639_1: 'en', name: 'English' },
    long_description:
      'We post information here about app store updates, new features and general news. Your feedback is welcome.',
    member_count: 6,
    name: 'Announcements',
    online: true,
    short_description:
      'Product updates (and a few random thoughts!) from our CEO Christopher',
    region: {
      cacheVersion: 0,
      geoname_id: 1,
      location: {
        lat: 43.002,
        lon: -89.424
      },
      name: 'Fitchburg, WI, USA'
    }
  };
  return data;
};
