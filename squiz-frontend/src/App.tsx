// Material ui
/* eslint-disable import/extensions,no-console,global-require */
import CssBaseline from '@material-ui/core/CssBaseline';
import I18nWrapper from 'components_2/hoc/i18n';
import { FirebaseAuthProvider } from 'hooks/useFirebaseAuth';
import { GlobalStatsProvider } from 'hooks/useGlobalStats';
import { initMParticle } from 'lib/mparticle/initialize';
import { initZenDesk } from 'lib/zendesk/initialize';
import * as log from 'loglevel';
import { LogLevelDesc } from 'loglevel';
import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import * as Branch from './api/branch';
import MaterialUiProvider from './Assets/Themes/MaterialUiProvider';
import './index.css';
import Routes from './Routes';
import './styles/main.scss';
import './tailwind.css';

Branch.init(branchData => {
  Branch.saveUTMs(window.location, branchData);
});

const App: React.FC = () => {
  useEffect(() => {
    if (process.env.REACT_APP_LOG_LEVEL) {
      log.setLevel(process.env.REACT_APP_LOG_LEVEL as LogLevelDesc);
    } else {
      log.setLevel('debug');
    }

    console.log = log.info;
    console.info = log.info;
    console.warn = log.warn;
    console.error = log.error;
    console.debug = log.debug;

    initMParticle();
    initZenDesk();
  }, []);

  return (
    <div className="font-ProximaNova bg-white">
      <Helmet>
        <link
          rel="preload"
          as="font"
          href={require('styles/fonts/ProximaNova-Bold.woff2')}
          type="font/woff2"
        />
        <link
          rel="preload"
          as="font"
          href={require('styles/fonts/ProximaNova-Semibold.woff2')}
          type="font/woff2"
        />
      </Helmet>

      <I18nWrapper>
        <MaterialUiProvider>
          <CssBaseline />
          <GlobalStatsProvider>
            <FirebaseAuthProvider>
              <Routes />
            </FirebaseAuthProvider>
          </GlobalStatsProvider>
        </MaterialUiProvider>
      </I18nWrapper>
    </div>
  );
};

export default App;
