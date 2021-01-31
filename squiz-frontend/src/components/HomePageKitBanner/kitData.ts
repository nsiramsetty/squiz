export const kitKeys = ['sleep', 'anxiety', 'stress', 'music', 'children'];

/* eslint-disable global-require */
export const kits = [
  {
    to: '/meditation-topics/sleep',
    title_top: 'Improve your',
    title_bottom: 'Sleep',
    background_image: `${require('assets_2/images/beginnerkits/sleep.jpg')}`,
    background_image_mobile: `${require('assets_2/images/beginnerkits/sleep-mobile.jpg')}`
  },
  {
    to: '/meditation-topics/anxiety',
    title_top: 'Coping with',
    title_bottom: 'Anxiety',
    background_image: `${require('assets_2/images/beginnerkits/anxiety-mountain.jpg')}`,
    background_image_mobile: `${require('assets_2/images/beginnerkits/anxiety-mobile.jpg')}`
  },
  {
    to: '/meditation-topics/stress',
    title_top: 'Managing',
    title_bottom: 'Stress',
    background_image: `${require('assets_2/images/beginnerkits/stress-ocean.jpg')}`,
    background_image_mobile: `${require('assets_2/images/beginnerkits/stress-mobile.jpg')}`
  },
  {
    to: '/meditation-topics/music',
    title_top: 'Meditation',
    title_bottom: 'Music',
    background_image: `${require('assets_2/images/beginnerkits/music-bamboo.jpg')}`,
    background_image_mobile: `${require('assets_2/images/beginnerkits/music-mobile.jpg')}`
  },
  {
    to: '/meditation-topics/children',
    title_top: 'Meditation for',
    title_bottom: 'Kids',
    background_image: `${require('assets_2/images/beginnerkits/kids.jpg')}`,
    background_image_mobile: `${require('assets_2/images/beginnerkits/kids-mobile.jpg')}`
  }
];
