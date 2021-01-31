import * as Branch from 'api/branch';
import * as GA from 'api/googleAnalytics';
import * as GTM from 'api/gtm';
import usePrevious from 'hooks/usePrevious';
import { PageTypes } from 'lib/mparticle/enums';
import { trackLandingPageWeb } from 'lib/mparticle/helpers';
import { trackEvent } from 'lib/mparticle/trackEvents';
import * as MParticle from 'lib/mparticle/trackPageView';
import { MParticleEventType } from 'lib/mparticle/types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { useHistory } from 'react-router';
import { initialState, reducer } from './PageViewTrackerContext';

const PageViewTrackerContext = React.createContext<
  | {
      pageType: PageTypes;
      deepLink?: string;
      trackPageView: (args: TrackPageViewArgs, isSendEvent?: boolean) => void;
    }
  | undefined
>(undefined);

export const PageViewTrackerProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname
  );
  const prevPath = usePrevious(currentPath);
  const isLandingRef = useRef(true);

  const [state, dispatch] = useReducer(reducer, initialState);

  // handle page change events
  useEffect(() => {
    const { branchData, pageType, pageData, deepLink, eventSent } = state;

    if (eventSent || !pageData) {
      return;
    }

    dispatch({ type: 'EVENT_SENT' });

    MParticle.trackPageView(window.location, pageType, pageData);

    GTM.pushDataLayer({
      event: 'virtual_page_view',
      pageUrl: window.location.pathname,
      pageQuery: window.location.search,
      pageTitle: document.title
    });

    Branch.setBranchViewData({
      ...branchData,
      deeplink: deepLink,
      deeplink_v2: deepLink
    });

    Branch.trackPageView();

    if (isLandingRef.current) {
      isLandingRef.current = false;

      // just to make sure we get the title as well.
      setTimeout(() => trackLandingPageWeb(), 500);

      Branch.getBranchLinkData(linkData => {
        if (linkData != null) {
          const data = pick(linkData.data_parsed, [
            '$sharer_user_id',
            '$share_link_id',
            '$share_created_date',
            '~campaign',
            '~channel',
            '~feature'
          ]);
          if (!isEmpty(data)) {
            trackEvent({
              event_name: 'share_attributed_web',
              event_type: MParticleEventType.Social,
              sharer_user_id: get(data, '$sharer_user_id'),
              share_link_id: get(data, '$share_link_id'),
              share_created_date: get(data, '$share_created_date'),
              '~campaign': get(data, '~campaign'),
              '~channel': get(data, '~channel'),
              '~feature': get(data, '~feature'),
              ...pageData
            });
          }
        }
      });
    }
  }, [state, dispatch]);

  // handle page changes.
  useEffect(() => {
    return history.listen(location => {
      if (location.pathname !== currentPath) {
        dispatch({ type: 'PAGE_CHANGED' });
        setCurrentPath(location.pathname);
        GTM.reset();
        GA.sendPageView();
        if (window.zE?.show) window.zE.show();
      }
    });
  }, [history, currentPath]);

  // handle window scrolling on page changes.
  useEffect(() => {
    if (
      currentPath &&
      (currentPath.match(/^.*starts-with-([a-z])$/) || currentPath === prevPath)
    )
      return;
    window.scroll(0, 0);
  }, [prevPath, currentPath]);

  const trackPageView = useCallback(
    (
      { pageType, deepLink, ...args }: TrackPageViewArgs,
      isSendEvent = true
    ) => {
      dispatch({
        type: 'TRACK_PAGE_VIEW',
        pageType,
        deepLink,
        branchData: pickBy(args, (_val, key) => key.startsWith('$')),
        pageData: pickBy(args, (_val, key) => !key.startsWith('$')),
        isSendEvent
      });
    },
    [dispatch]
  );

  return (
    <PageViewTrackerContext.Provider
      value={{
        trackPageView,
        pageType: state.pageType,
        deepLink: state.deepLink
      }}
    >
      {children}
    </PageViewTrackerContext.Provider>
  );
};

export const usePageViewTracker = () => {
  const context = useContext(PageViewTrackerContext);
  if (context === undefined) {
    throw new Error('Missing Provider!');
  }
  return context;
};

export type TrackPageViewArgs =
  | {
      pageType: PageTypes;
      slug?: string;
      page_language?: string;
      deepLink?: string;
      $og_title?: string;
      $og_description?: string;
      $og_image_url?: string;
    }
  | {
      pageType: PageTypes.ContentfulPage;
      deepLink?: string;
      slug: string;
      page_language: string;
    }
  | {
      pageType: PageTypes.CircleGroupPage;
      deepLink: string;
      page_language: string;
      slug?: string;
      group_id: string;
      group_name: string;
      group_type: string;
      group_host_user_id: string;
      group_is_workplace: boolean;
      email_domain: string;
      $og_title?: string;
      $og_description?: string;
      $og_image_url?: string;
    }
  | {
      pageType: PageTypes.CourseDetails;
      deepLink: string;
      slug: string;
      publisher_id: string;
      publisher_name: string;
      course_id: string;
      course_name: string;
      page_language: string;
      $og_title: string;
      $og_description: string;
      $og_image_url: string;
      $og_audio: string;
      $og_audio_type: 'audio/mpeg';
      $content_type: 'course';
      $rating_score: number;
      $duration_days: number;
      $publisher_name: string;
    }
  | {
      pageType: PageTypes.GmDetails;
      deepLink: string;
      page_language: string;
      slug: string;
      publisher_id: string;
      publisher_name: string;
      media_item_id: string;
      media_item_name: string;
      $og_title: string;
      $og_description: string;
      $og_image_url: string;
      $og_audio: string;
      $og_audio_type: 'audio/mpeg';
      $content_type: string;
      $rating_score: number;
      $duration_seconds: number;
      $play_count: number;
      $publisher_name: string;
    }
  | {
      pageType: PageTypes.TeacherProfile;
      deepLink: string;
      page_language: string;
      slug: string;
      publisher_id: string;
      publisher_name: string;
      $og_title?: string;
      $og_description?: string;
      $og_image_url?: string;
    }
  | {
      pageType: PageTypes.TopicDetails;
      deepLink: string;
      slug?: string;
      interest_id: string;
      $og_title?: string;
      $og_description?: string;
      $og_image_url?: string;
    }
  | {
      pageType: PageTypes.TopicDetails;
      deepLink?: string;
      slug?: string;
    }
  | {
      pageType: PageTypes.Login | PageTypes.Logout | PageTypes.Signup;
      deepLink?: string;
    }
  | {
      pageType: PageTypes.PlaylistPlayer | PageTypes.PlaylistDetails;
      slug?: string;
      deepLink?: string;
      publisher_id?: string;
      publisher_name?: string;
      playlist_id: string;
      playlist_name: string;
    };
