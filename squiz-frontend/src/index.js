// import 'react-app-polyfill/ie9';
// Context provider
import { initializeReactGA } from 'api/googleAnalytics';
import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import App from './App';
import {
  // registerServiceWorker,
  unregister
} from './registerServiceWorker';

initializeReactGA();

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.getElementById('root')
);

// Service worker is disabled for now, somehow it doesnt work well with Nginx proxy pass.
// to make it work with prerender.io
// registerServiceWorker();
unregister();
