import { I18nProvider } from '@lingui/react';
import NotifyLink from 'components/Notification/NotifyLink';
import NotifyMessage from 'components/Notification/NotifyMessage';
import { AuthPopupProvider } from 'hooks/useAuthPopup';
import { GetAppPopupProvider } from 'hooks/useGetAppPopup';
import { HeaderProvider } from 'hooks/useHeader';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { NotificationProvider } from 'hooks/useNotification';
import { SharePopupProvider } from 'hooks/useSharePopup';
import { useTaxonomy } from 'hooks/useTaxonomy';
import React, { lazy, Suspense } from 'react';
import { isMobile } from 'react-device-detect';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Auth from 'views_2/Auth';
import FunnelHome from 'views_2/FunnelHome';
import {
  getBaseLocale,
  getSessionLanguage,
  setSessionLanguage
} from '../locales/helpers';
import { i18n, Locales } from '../locales/i18nLingui';

const About = lazy(() => import('Views/About'));
const MediaEnquiries = lazy(() => import('Views/MediaEnquiries'));
const MeditateAtWork = lazy(() => import('Views/MeditateAtWork'));
const Local = lazy(() => import('Views/LocalPage'));
const MeditationGroups = lazy(() => import('Views/MeditationGroups/landing'));
const CookiePolicy = lazy(() => import('Views/CookiePolicy'));
const MeditationOrigins = lazy(() => import('Views/Topics/med_origins'));
const MeditationBenefits = lazy(() => import('Views/Topics/med_benefits'));
const MeditationPractices = lazy(() => import('Views/Topics/med_practices'));

const PasswordReset = lazy(() => import('components/PasswordReset'));
const PageNotFound = lazy(() => import('components_2/pageNotFound'));

const ABtest = lazy(() => import('views_2/ABtest'));
const FreeForever = lazy(() => import('views_2/FreeForever'));
const FreeTimer = lazy(() => import('views_2/FreeTimer'));
const SeeAllLocalTeachers = lazy(() => import('views_2/LocalTeachers'));

const ResetPassword = lazy(() => import('views_2/ResetPassword'));
const UserProfile = lazy(() => import('views_2/User/profile'));
const ManageSubscription = lazy(() => import('views_2/ManageSubscription'));
const Invoices = lazy(() => import('views_2/ManageSubscription/Invoices'));
const Courses = lazy(() => import('views_2/Course/browse'));
const CoursesSlug = lazy(() => import('views_2/Course/details'));
const Player = lazy(() => import('views_2/Player'));
const PlaylistBrowse = lazy(() => import('views_2/Playlists/browse'));
const PlaylistDetails = lazy(() => import('views_2/Playlists/details'));
const Hashtag = lazy(() => import('views_2/Hashtag'));
const PlaylistHashTag = lazy(() => import('views_2/Playlists/hashtag'));
const MyPlaylists = lazy(() => import('views_2/MyPlaylists'));
const LibraryItemDetails = lazy(() => import('views_2/LibraryItem/details'));
const BrowsePage = lazy(() => import('views_2/LibraryItem/browse'));
const BrowsePageByTopic = lazy(() =>
  import('views_2/LibraryItem/browse/topic')
);
const TeacherDetails = lazy(() => import('views_2/PublisherProfile'));
const Teachers = lazy(() => import('views_2/Publisher/browse'));
const MeditationTeachersJoin = lazy(() => import('views_2/Teacher/join/v2'));
const Live = lazy(() => import('views_2/Live'));
const MyBookmarks = lazy(() => import('views_2/MyBookmarks'));
const TopicsAll = lazy(() => import('views_2/Topics/seeAll'));
const TopicDetails = lazy(() => import('views_2/Topics/details'));
const TopicMusicDetails = lazy(() => import('views_2/Topics/details/music'));
const TopicKidsDetails = lazy(() => import('views_2/Topics/details/kids'));
const CoronaVirus = lazy(() => import('views_2/Topics/coronavirus'));
const SubTopics = lazy(() => import('views_2/Topics/SubTopics'));
const MemberPlusV2 = lazy(() => import('views_2/MemberPlus/v2'));
const LocalPublisher = lazy(() => import('views_2/Local'));

const LocalDirectory = lazy(() => import('directory/local'));
const CourseDirectory = lazy(() => import('directory/course'));
const TeacherDirectory = lazy(() => import('directory/teachers'));
const PlaylistsDirectory = lazy(() => import('directory/playlist'));
const GmDirectory = lazy(() => import('directory/gms'));
const GmByTopicDirectory = lazy(() => import('directory/gms/details'));

const FunnelHomeIntl = lazy(() => import('views_2/FunnelHome/intl'));
const FunnelHomeEnglishIntl = lazy(() =>
  import('views_2/FunnelHome/intl/english')
);
const CoursesIntl = lazy(() => import('views_2/Course/browse/intl'));

const HelpNow = lazy(() => import('views_2/HelpNow'));
const Yoga = lazy(() => import('views_2/Yoga'));
const CirclesTeams = lazy(() => import('views_2/CircleTeam'));
const Circle = lazy(() => import('views_2/Circles/Circle'));

const FreeTrial = lazy(() => import('components/FreeTrial'));
const Contentful = lazy(() => import('components/Contentful'));
const ContentfulPreview = lazy(() => import('components/Contentful/preview'));

const DevelopmentRoute = (component: any) => {
  return (
    (window.location.hostname.indexOf('insighttimer.com') === -1 &&
      window.location.hostname.indexOf('www.insighttimer.com') === -1 &&
      component) ||
    PageNotFound
  );
};

export const IntlPages = ({ match }: RouteComponentProps<{ lang: string }>) => {
  const currLang =
    match.params.lang === 'br'
      ? Locales.BrazilianPortuguese
      : (match.params.lang as Locales);

  const i18n = useLinguiI18n();
  i18n.activate(getBaseLocale(currLang));
  const taxonomy = useTaxonomy(currLang);

  const sessionLanguage = getSessionLanguage();
  if (!sessionLanguage) {
    setSessionLanguage(currLang);
  }

  return (
    <I18nProvider i18n={i18n} language={getBaseLocale(currLang)}>
      <AuthPopupProvider>
        <NotificationProvider>
          <SharePopupProvider>
            <GetAppPopupProvider>
              <Suspense fallback={<></>}>
                <Switch>
                  <Route
                    exact
                    path={`/:lang(es|fr|de|ru|br|it|nl)/${taxonomy.config.play}`}
                    component={Player}
                  />

                  <Route
                    exact
                    path={`/:lang(es|fr|de|br|nl)/${taxonomy.config.freeTrial}`}
                    component={DevelopmentRoute(FreeTrial)}
                  />

                  <Route>
                    <HeaderProvider intlHeader>
                      <Suspense fallback={<></>}>
                        <Switch>
                          <Route
                            exact
                            path={`${match.path}`}
                            component={FunnelHomeIntl}
                          />

                          <Route
                            exact
                            path="/br/meditacao-topicos/:slug"
                            render={props => {
                              const jsonFileName = `br__meditacao-topicos__${props.match.params.slug}`;
                              return <Contentful jsonFileName={jsonFileName} />;
                            }}
                          />

                          <Route path="/:lang(es|fr|de|ru|br|it|nl)">
                            <Switch>
                              <Route
                                exact
                                path={`${match.path}/${taxonomy.config.meditationCourses}`}
                                component={CoursesIntl}
                              />

                              <Route
                                exact
                                path={`${match.path}/${taxonomy.config.guidedMeditations}`}
                                component={BrowsePage}
                              />

                              <Route
                                exact
                                path={`${match.path}/${taxonomy.config.guidedMeditations}/:slug`}
                                component={LibraryItemDetails}
                              />

                              <Route
                                exact
                                path={`${match.path}/${taxonomy.config.meditationCourses}/:slug`}
                                component={CoursesSlug}
                              />

                              <Route
                                exact
                                path={`${match.path}/${taxonomy.config.meditationTeachers}/:slug`}
                                component={TeacherDetails}
                              />

                              <Route
                                exact
                                path={`${match.path}/${taxonomy.config.resetPassword}`}
                                component={ResetPassword}
                              />

                              <Route
                                exact
                                path={`${match.path}/member-plus`}
                                component={DevelopmentRoute(MemberPlusV2)}
                              />

                              <Route
                                exact
                                path={`${match.path}/:slug`}
                                render={props => {
                                  const { lang, slug } = props.match.params;
                                  const jsonFileName = `${lang}__${slug}`;
                                  return (
                                    <Contentful jsonFileName={jsonFileName} />
                                  );
                                }}
                              />
                            </Switch>
                          </Route>

                          <Route component={PageNotFound} />
                        </Switch>
                      </Suspense>
                    </HeaderProvider>
                  </Route>
                </Switch>
              </Suspense>
            </GetAppPopupProvider>
          </SharePopupProvider>
        </NotificationProvider>
      </AuthPopupProvider>
    </I18nProvider>
  );
};

export const Pages = () => {
  const i18n = useLinguiI18n();
  i18n.activate(Locales.English);
  return (
    <I18nProvider i18n={i18n} language={Locales.English}>
      <AuthPopupProvider>
        <NotificationProvider>
          <SharePopupProvider>
            <GetAppPopupProvider>
              <Suspense fallback={<></>}>
                <Switch>
                  <Route path="/circles/:circleId" component={Circle} />

                  {/* player */}
                  <Route path="/play" component={Player} />

                  {/* free trial */}
                  <Route
                    exact
                    path="/subscribe/free-trial"
                    component={FreeTrial}
                  />

                  <Route>
                    <HeaderLayout>
                      <Route
                        exact
                        path="/:lang(en-au|en-ca|en-gb|en-in)"
                        component={FunnelHomeEnglishIntl}
                      />
                      <Route
                        exact
                        path="/ab-test"
                        component={DevelopmentRoute(ABtest)}
                      />
                      <Route
                        exact
                        path="/my-playlists"
                        component={DevelopmentRoute(MyPlaylists)}
                      />
                      <Route
                        exact
                        path="/my-profile"
                        component={DevelopmentRoute(UserProfile)}
                      />
                      <Route
                        exact
                        path="/my-bookmarks"
                        component={DevelopmentRoute(MyBookmarks)}
                      />

                      <Route
                        exact
                        path="/contentful/:entryId"
                        component={DevelopmentRoute(ContentfulPreview)}
                      />

                      {/* live */}
                      <Route exact path="/live" component={Live} />

                      <Route exact path="/yoga" component={Yoga} />

                      <Route
                        exact
                        path="/yoga/:slug"
                        render={props => {
                          const jsonFileName = `yoga__${props.match.params.slug}`;
                          return <Contentful jsonFileName={jsonFileName} />;
                        }}
                      />

                      <Route
                        exact
                        path="/"
                        render={props => <FunnelHome {...props} />}
                      />

                      <Route
                        exact
                        path={[
                          '/:lang(br)/meditação-guiada/:page([1-9]d*)?',
                          '/:lang(br)/meditação-guiada/:filter(popular)'
                        ]}
                        component={BrowsePage}
                      />

                      <Route
                        exact
                        path="/dir/local"
                        component={LocalDirectory}
                      />

                      <Route
                        sensitive
                        exact
                        path="/local/:country/:city"
                        component={LocalPublisher}
                      />

                      <Route
                        sensitive
                        exact
                        path="/local/:country/:city/meditation-teachers/:page([1-9]\d*)?"
                        component={SeeAllLocalTeachers}
                      />
                      <Route exact path="/local" component={Local} />

                      <Route
                        exact
                        path="/meditation-playlists"
                        component={PlaylistBrowse}
                      />

                      <Route exact path="/hashtag" component={Hashtag} />

                      <Route
                        exact
                        path="/hashtag/:hashtag/:page([1-9]\d*)?"
                        component={PlaylistHashTag}
                      />

                      <Route
                        exact
                        path="/meditation-playlists/:id"
                        component={PlaylistDetails}
                      />
                      <Route
                        exact
                        path="/playlists/:id"
                        component={PlaylistDetails}
                      />

                      {/* Course  directory */}
                      <Route
                        exact
                        path="/dir/meditation-courses"
                        component={CourseDirectory}
                      />

                      {/* Teacher  directory */}
                      <Route
                        exact
                        path="/dir/meditation-teachers"
                        component={TeacherDirectory}
                      />
                      <Route
                        sensitive
                        path="/dir/meditation-teachers/:startwith(hash|more|[a-z]{1})"
                        component={TeacherDirectory}
                      />

                      {/* Playlists  directory */}
                      <Route
                        exact
                        path="/dir/playlists"
                        component={PlaylistsDirectory}
                      />
                      <Route
                        sensitive
                        path="/dir/playlists/:startwith(hash|more|[a-z]{1})"
                        component={PlaylistsDirectory}
                      />

                      {/* Topic  directory */}
                      <Route
                        exact
                        path="/dir/guided-meditations"
                        component={GmDirectory}
                      />
                      <Route
                        exact
                        path="/dir/guided-meditations/:meditationTopic"
                        component={GmByTopicDirectory}
                      />
                      <Route
                        sensitive
                        exact
                        path="/dir/guided-meditations/:meditationTopic/:startwith(hash|more|[a-z]{1})"
                        component={GmByTopicDirectory}
                      />

                      {/* Login */}
                      <Route
                        exact
                        path="/login"
                        render={props => <Auth authType="login" {...props} />}
                      />
                      <Route
                        exact
                        path="/signup"
                        render={props => <Auth authType="signup" {...props} />}
                      />
                      <Route
                        exact
                        path="/logout"
                        render={props => <Auth authType="logout" {...props} />}
                      />

                      <Route
                        exact
                        path="/reset-password"
                        component={ResetPassword}
                      />

                      <Route
                        exact
                        path="/password-reset"
                        component={PasswordReset}
                      />

                      {/* User */}

                      {/* Manage subscription */}
                      <Route
                        exact
                        path="/manage-subscription"
                        component={ManageSubscription}
                      />
                      <Route
                        exact
                        path="/manage-subscription/invoices"
                        component={Invoices}
                      />

                      {/* static */}
                      <Route
                        exact
                        path="/meditation-app"
                        component={FreeForever}
                      />
                      <Route exact path="/about" component={About} />

                      <Route
                        exact
                        path="/member-plus"
                        component={MemberPlusV2}
                      />
                      <Route
                        exact
                        path="/premium"
                        component={() => <Redirect to="/member-plus" />}
                      />

                      <Route exact path="/teams" component={CirclesTeams} />

                      <Route
                        exact
                        path="/cookie-policy"
                        component={CookiePolicy}
                      />

                      <Route
                        exact
                        path="/meditation-timer"
                        component={FreeTimer}
                      />
                      <Route
                        exact
                        path="/media-enquiries"
                        component={MediaEnquiries}
                      />
                      <Route
                        exact
                        path="/meditate-at-work"
                        component={MeditateAtWork}
                      />
                      {/* <Route exact={true} path="/sitemap" component={Sitemap} /> */}

                      <Route
                        exact
                        path="/meditation-groups"
                        component={MeditationGroups}
                      />

                      {/* guided meditations */}
                      <Route
                        exact
                        path={[
                          '/guided-meditations/:page([1-9]d*)?',
                          '/guided-meditations/:filter(popular)'
                        ]}
                        component={BrowsePage}
                      />

                      <Route
                        exact
                        path="/:teacher/guided-meditations/:slug"
                        component={LibraryItemDetails}
                      />

                      {/* <Route exact={true} path="/guided-meditations/:filter(new|popular|staff-picks|browse)?" component={BrowsePage} /> */}

                      {/* teachers */}
                      <Route
                        exact
                        path="/meditation-teachers"
                        component={Teachers}
                      />

                      <Route
                        path="/meditation-teachers/join"
                        component={MeditationTeachersJoin}
                      />

                      <Route
                        exact
                        path="/meditation-teachers/:slug(popular|new|starts-with-[aA-zZ]{1})/:page([1-9]\d*)?"
                        component={Teachers}
                      />

                      {/* courses */}
                      <Route
                        exact
                        path="/meditation-courses"
                        component={Courses}
                      />

                      <Route
                        exact
                        path="/meditation-courses/:slug(popular|new|confidence|healing|spirituality|music|stress|happiness|goals|sleep|love)"
                        component={Courses}
                      />

                      <Route
                        exact
                        path="/meditation-courses/:slug"
                        component={CoursesSlug}
                      />

                      <Route
                        exact
                        path="/meditation-topics/coronavirus"
                        component={CoronaVirus}
                      />
                      <Route
                        exact
                        path="/meditation-topics/:topic/browse/all"
                        component={({
                          match
                        }: RouteComponentProps<{ topic: string }>) => (
                          <Redirect
                            to={`/meditation-topics/${match.params.topic}`}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/meditation-topics/:topic/browse/:type(talks|music|guided)/:page([1-9]\d*)?"
                        component={BrowsePageByTopic}
                      />
                      <Route
                        path="/meditation-topics/:topic/browse/:type/:page([^-]*)"
                        component={({
                          match
                        }: RouteComponentProps<{ topic: string }>) => (
                          <Redirect
                            to={`/meditation-topics/${match.params.topic}/browse/guided`}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/meditation-topics/:topic/browse"
                        component={({
                          match
                        }: RouteComponentProps<{ topic: string }>) => (
                          <Redirect
                            to={`/meditation-topics/${match.params.topic}`}
                          />
                        )}
                      />

                      <Route
                        exact
                        path="/meditation-practices"
                        component={MeditationPractices}
                      />
                      <Route
                        exact
                        path="/meditation-origins"
                        component={MeditationOrigins}
                      />
                      <Route
                        exact
                        path="/meditation-benefits"
                        component={MeditationBenefits}
                      />

                      <Route
                        path="/meditation-origins/:slug"
                        component={({
                          match
                        }: RouteComponentProps<{ slug: string }>) => (
                          <Redirect
                            to={`/meditation-topics/${match.params.slug}`}
                          />
                        )}
                      />
                      <Route
                        path="/meditation-benefits/:slug"
                        component={({
                          match
                        }: RouteComponentProps<{ slug: string }>) => (
                          <Redirect
                            to={`/meditation-topics/${match.params.slug}`}
                          />
                        )}
                      />
                      <Route
                        path="/meditation-practices/:slug"
                        component={({
                          match
                        }: RouteComponentProps<{ slug: string }>) => (
                          <Redirect
                            to={`/meditation-topics/${match.params.slug}`}
                          />
                        )}
                      />

                      <Route
                        exact
                        path="/meditation-topics"
                        component={TopicsAll}
                      />
                      <Route
                        exact
                        path="/meditation-music"
                        render={props => {
                          props.match.params.slug = 'music';
                          return <TopicMusicDetails {...props} />;
                        }}
                      />
                      <Route
                        exact
                        path="/meditation-music/:page([1-9]\d*)?"
                        render={props => {
                          props.match.params.slug = 'music';
                          return <TopicMusicDetails {...props} />;
                        }}
                      />
                      <Route
                        path="/meditation-music/:slug"
                        component={({
                          match
                        }: RouteComponentProps<{ slug: string }>) => (
                          <Redirect
                            to={`/meditation-topics/${match.params.slug}`}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/meditation-topics/children"
                        render={props => {
                          props.match.params.slug = 'children';
                          return <TopicKidsDetails {...props} />;
                        }}
                      />
                      <Route
                        exact
                        path="/meditation-topics/children/:page([1-9]\d*)?"
                        render={props => {
                          props.match.params.slug = 'children';
                          return <TopicKidsDetails {...props} />;
                        }}
                      />
                      <Route
                        exact
                        path="/meditation-topics/:slug"
                        render={props => {
                          const jsonFileName = `meditation-topics__${props.match.params.slug}`;
                          return (
                            <Contentful
                              jsonFileName={jsonFileName}
                              fallback={<TopicDetails />}
                            />
                          );
                        }}
                      />
                      <Route
                        exact
                        path="/meditation-topics/:slug/:page([1-9]\d*)?"
                        component={TopicDetails}
                      />
                      {/* topics */}
                      <Route
                        exact
                        path="/meditation-topics/:topic/:subtopic"
                        render={props => {
                          const { topic, subtopic } = props.match.params;
                          const jsonFileName = `meditation-topics__${topic}__${subtopic}`;
                          return (
                            <Contentful
                              jsonFileName={jsonFileName}
                              fallback={<SubTopics {...props} />}
                            />
                          );
                        }}
                      />
                      {/* local */}
                      <Route
                        exact
                        path="/:citySlug(newyork-us|losangeles-us|london-gb|sanfrancisco-us|chicago-us|washington-us|sydney-au|melbourne-au|seattle-us|toronto-ca)/meditation"
                        render={props => {
                          const locArray = props.match.params.citySlug.split(
                            '-'
                          );
                          const country = locArray[1];
                          let newCity = locArray[0];

                          switch (newCity) {
                            case 'newyork':
                              newCity = 'new-york';
                              break;
                            case 'losangeles':
                              newCity = 'los-angeles';
                              break;
                            case 'sanfrancisco':
                              newCity = 'san-francisco';
                              break;
                            default:
                              break;
                          }

                          return (
                            <Redirect to={`/local/${country}/${newCity}`} />
                          );
                        }}
                      />

                      <Route exact path="/help-now" component={HelpNow} />

                      {/* TeacherProfile */}
                      <Route exact path="/:slug" component={TeacherDetails} />

                      <Route component={PageNotFound} />
                    </HeaderLayout>
                  </Route>
                </Switch>
              </Suspense>
            </GetAppPopupProvider>
          </SharePopupProvider>
        </NotificationProvider>
      </AuthPopupProvider>
    </I18nProvider>
  );
};

const HeaderLayout: React.FC = ({ children }) => {
  return (
    <HeaderProvider>
      <NotifyMessage
        id={
          i18n.language === Locales.English
            ? 'browse_live_events_notification'
            : undefined
        }
      >
        {isMobile
          ? "Connect and engage with the world's best teachers, Live, every hour of the day for free."
          : "Connect with the world's best teachers, Live, every hour of the day for free."}
        <NotifyLink to="/live">
          {isMobile ? 'Browse' : 'Browse Live events'}
        </NotifyLink>
      </NotifyMessage>
      <Suspense fallback={<></>}>
        <Switch>{children}</Switch>
      </Suspense>
    </HeaderProvider>
  );
};
