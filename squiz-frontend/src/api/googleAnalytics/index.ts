import ReactGA from 'react-ga';

// for ga-12 profile

export const initializeReactGA = () => {
  if (
    process.env.REACT_APP_GOOGLE_ANALYTICS_KEY &&
    process.env.REACT_APP_GOOGLE_ANALYTICS_KEY !== 'disable'
  )
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_KEY);
};

export const sendPageView = () => {
  if (process.env.REACT_APP_GOOGLE_ANALYTICS_KEY !== 'disable')
    ReactGA.pageview(window.location.pathname + window.location.search);
};
