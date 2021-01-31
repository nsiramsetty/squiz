// COURSES_QUERIES Button Lable and Value

export const COURSES_QUERIES = [
  {
    label: 'Popular',
    value: 'popular'
  },
  {
    label: 'New',
    value: 'new'
  },
  {
    label: 'Confidence',
    value: 'confidence'
  },
  {
    label: 'Healing',
    value: 'healing'
  },
  {
    label: 'Spirituality',
    value: 'spirituality'
  },
  {
    label: 'Music',
    value: 'music'
  },
  {
    label: 'Stress',
    value: 'stress'
  },
  {
    label: 'Happiness',
    value: 'happiness'
  },
  {
    label: 'Goals',
    value: 'goals'
  },
  {
    label: 'Sleep',
    value: 'sleep'
  },
  {
    label: 'Love',
    value: 'love'
  }
];

export const GUIDED_MEDITATIONS_FILTER_BUTTONS = [
  {
    label: 'Popular',
    value: 'popular'
  },
  {
    label: 'New',
    value: 'new'
  },
  {
    label: 'Staff Picks',
    value: 'staff-picks'
  }
];

export const WEBAPP_HOST = process.env.REACT_APP_WEBAPP_HOST;
export const FREETRIAL_URL = process.env.REACT_APP_7DFT_LINK;
export const HOST_URL = process.env.REACT_APP_FIREBASE_apiHostURL;
export const AUTH_URL_HOST = process.env.REACT_APP_FIREBASE_authHostURL;
export const MPARTICLE_MODE =
  process.env.REACT_APP_MPARTICLE_MODE !== 'production';
export const FACEBOOK_ID = process.env.REACT_APP_FACEBOOK_ID;
export const WEB_HOST = process.env.REACT_APP_WEB_HOST;
export const API_HOST = process.env.REACT_APP_API_HOST;
export const PRIVATE_HOST_URL =
  process.env.REACT_APP_FIREBASE_apiHostURLPrivate;
export const STRIPE_SCRIPT_URL = process.env.REACT_APP_STRIPE_SCRIPT_URL;
export const ENABLE_SESSION_LOGIN = process.env.REACT_APP_ENABLE_SESSION_LOGIN;
export const WEB_DOMAIN = process.env.REACT_APP_WEB_DOMAIN;
export const FILTER_API_HOST = process.env.REACT_APP_FILTER_API_HOST;

// export const SOURCE_URL = process.env.REACT_APP_FIREBASE_projectId === 'insight-timer-a1ac7' && process.env.NODE_ENV === 'production' ? 'https://insight-timer-public.firebaseapp.com/' : 'https://insight-timer-public.firebaseapp.com/'

export function srcImage(imgObj) {
  if (
    imgObj.startsWith('/static/media') &&
    process.env.NODE_ENV === 'production'
  ) {
    if (
      process.env.REACT_APP_FIREBASE_projectId === 'insight-timer-a1ac7' ||
      process.env.REACT_APP_FIREBASE_projectId === 'insight-timer-prototype'
    ) {
      return process.env.REACT_APP_FIREBASE_hostingURL + imgObj;
    }
    return imgObj;
  }
  return imgObj;
}

export const LANGUAGES = [
  {
    iso_639_1: 'br',
    name: 'Brazilian'
  },
  {
    iso_639_1: 'de',
    name: 'German'
  },
  {
    iso_639_1: 'en',
    name: 'English'
  },
  {
    iso_639_1: 'es',
    name: 'Spanish'
  },
  {
    iso_639_1: 'fr',
    name: 'French'
  },
  {
    iso_639_1: 'it',
    name: 'Italian'
  },
  {
    iso_639_1: 'ja',
    name: 'Japanese'
  },
  {
    iso_639_1: 'nl',
    name: 'Dutch'
  },
  {
    iso_639_1: 'pt',
    name: 'Portuguese'
  },
  {
    iso_639_1: 'ru',
    name: 'Russian'
  }
];

export const CONTENT_LENGTH_BUTTONS_FOR_GM_BROWSE_PAGE = [
  {
    queryParam: '5',
    btnText: '5 minutes'
  },
  {
    queryParam: '10',
    btnText: '10 minutes'
  },
  {
    queryParam: '15',
    btnText: '15 minutes'
  },
  {
    queryParam: '20',
    btnText: '20 minutes'
  },
  {
    queryParam: '30',
    btnText: '30 minutes'
  },
  {
    queryParam: 'over-30',
    btnText: '30+ minutes'
  }
];

export const ERROR_MESSAGES = {
  name_required: 'Full Name is required.',
  email_required: 'Email is required.',
  email_registered: 'Email is already registered.',
  email_wrong_format: 'Email is invalid.',
  password_required: 'Password is required.',
  password_min_required: 'Password minimum 6 chars.',
  password_alpha_required:
    'Only alphanumeric and . , + = ! ? ( ) [ ] characters allowed.',
  register_failed: 'Register failed, please try again later.',
  login_failed: 'Login failed, please try again later.',
  login_incorrect: 'Email or password is incorrect.',
  facebook_failed: 'Failed to login with facebook.'
};
