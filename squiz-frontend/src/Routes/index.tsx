import { PageViewTrackerProvider } from 'context/PageViewTracker';
import { LinguiI18nContextProvider } from 'hooks/useLinguiI18n';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { IntlPages, Pages } from './routes';

export const isDevelopmentRoute = () => {
  return window.location.hostname.indexOf('insighttimer.com') === -1;
};

const Routes: React.FC<{}> = () => {
  return (
    <BrowserRouter>
      <PageViewTrackerProvider>
        <LinguiI18nContextProvider>
          <Switch>
            {/* for debugging and logging in as another user with custom token.
              <Route
                path="/auth"
                component={() => {
                  firebaseAuth.signInWithCustomToken('');
                  return null;
                }}
              /> */}
            <Route
              path="/:lang(br|es|es-es|es-mx|de|de-de|fr|nl|it|fr-fr|fr-ca)"
              component={IntlPages}
            />

            {isDevelopmentRoute() && (
              <Route path="/:lang(ru)" component={IntlPages} />
            )}

            <Route path="/" component={Pages} />
          </Switch>
        </LinguiI18nContextProvider>
      </PageViewTrackerProvider>
    </BrowserRouter>
  );
};

export default Routes;
