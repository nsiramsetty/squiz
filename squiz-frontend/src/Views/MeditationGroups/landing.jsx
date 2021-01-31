import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as gtm from 'api/gtm';
import * as api from 'api/insight';
import MissingImage from 'Assets/images/avatars/missing.png';
import AddMetaDescription from 'components/AddMetaDescription';
// import AppDownload from 'components_old/AppDownload';
import AppDownload from 'components_2/base/LibraryItemPromotionTiles/appDownload';
import Modal from 'components_2/base/Modal';
import Footer from 'components_2/footer';
import { numberConvert } from 'helpers/numerals';
import { PageTypes } from 'lib/mparticle/enums';
import * as mparticle from 'lib/mparticle/loggers';
import queryString from 'query-string';
import React, { Component } from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import MeditationGroupLoader from './loader';
import { getGroups } from './resources/apiCalls';

const styles = theme => ({
  layout: {
    margin: 'auto',
    width: '100%',
    paddingLeft: '15px',
    paddingRight: '15px',
    [theme.breakpoints.up(576)]: {
      maxWidth: '540px'
    },
    [theme.breakpoints.up(768)]: {
      maxWidth: '720px'
    },
    [theme.breakpoints.up(992)]: {
      maxWidth: '960px'
    },
    [theme.breakpoints.up(1200)]: {
      maxWidth: '1140px'
    }
  },

  flexBasis: {
    flexBasis: '33.333333%'
  }
});
class MeditationGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoader: false,
      groupObj: null,
      currentGroupName: '',
      currentGroupId: '',
      meditators: 7400000
    };
  }

  fillData = page => {
    mparticle.logPageViewed(this.props.location, PageTypes.MeditationGroups);
    gtm.pushDataLayer({
      event: 'virtual_page_view',
      pageTitle: `Meditation Groups | Insight Timer`,
      pageUrl: this.props.location.pathname,
      pageQuery: this.props.location.search
    });

    this.setState({ pageLoader: true });

    getGroups(page * 24)
      .then(resp => {
        this.setState({
          pageLoader: false,
          groupObj: resp
        });
      })
      .catch(err => {
        console.warn(err);
      });
  };

  render() {
    const {
      pageLoader,
      groupObj,
      openPopUp,
      currentGroupName,
      meditators
    } = this.state;
    const { location } = this.props;
    const queryObject = queryString.parse(location.search);
    const pageNumber = queryObject.page ? parseInt(queryObject.page, 10) : 0;
    const totalGroupCount =
      groupObj !== null && groupObj !== undefined ? groupObj.total_count : 0;
    const totalPageCount =
      totalGroupCount % 24 === 0
        ? Math.floor(totalGroupCount / 24) - 1
        : Math.floor(totalGroupCount / 24);
    const title = this.props.intl.formatMessage(
      {
        id: 'meditation_groups.description'
      },
      { groupCount: totalGroupCount }
    );

    let prev = pageNumber;
    let next = pageNumber;
    prev -= 1;
    next += 1;
    let slug;

    const { classes } = this.props;

    return (
      <div className="overflow-hidden">
        <div style={{ paddingTop: '100px' }} className={classes.layout}>
          {pageLoader ? (
            <MeditationGroupLoader />
          ) : (
            <div className="w-full container">
              <AddMetaDescription>
                <title>Meditation Groups | Insight Timer</title>
                <meta name="author" content="Insight Network, Inc." />
                <meta
                  name="copyright"
                  content="Insight Network, Inc. Copyright (c) 2019"
                />
                <meta name="description" content={title} />
                <meta
                  name="keywords"
                  content="insight timer, meditation groups, meet ups"
                />

                <meta property="og:type" content="website" />
                <meta
                  property="og:image"
                  content="https://publicdata.insighttimer.com/public/images/bell_icon_big.png?1544064907"
                />
                <meta property="og:image:width" content="200" />
                <meta property="og:image:height" content="200" />
                <meta
                  property="og:url"
                  content={`https://insighttimer.com/meditation-groups${
                    pageNumber > 0 ? `?page=${pageNumber}` : ''
                  }`}
                />
                <meta
                  property="og:title"
                  content="Meditation Groups | Insight Timer"
                />
                <meta property="og:description" content={title} />

                {pageNumber > 0 && (
                  <link
                    rel="prev"
                    href={`https://insighttimer.com/meditation-groups${
                      prev > 0 ? `?page=${prev}` : ''
                    }`}
                  />
                )}
                {pageNumber < totalPageCount && (
                  <link
                    rel="next"
                    href={`https://insighttimer.com/meditation-groups${
                      next < totalPageCount ? `?page=${next}` : ''
                    }`}
                  />
                )}
                <link
                  rel="canonical"
                  href={`https://insighttimer.com/meditation-groups${
                    pageNumber > 0 ? `?page=${pageNumber}` : ''
                  }`}
                />
              </AddMetaDescription>
              <div className="row">
                <div className="col">
                  <h1 className="text-4xl text-center font-ProxiBold mt-10 mb-8">
                    {/* <FormattedHTMLMessage
                    id='meditation_groups.heading'
                    defaultMessage={`Insight Groups`}
                  /> */}
                    Insight Groups
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p className="font-ProxiRegular leading-tight text-xl md:text-2xl text-center mx-auto my-0 block max-w-3xl">
                    {title}
                  </p>
                </div>
              </div>
              <div className="row mt-12">
                <div className="col">
                  <h2 className="text-2xl leading-relaxed mt-8 font-ProxiSemibold ">
                    <FormattedHTMLMessage
                      id="meditation_groups.sub_heading"
                      defaultMessage="Meditation Meetups and Groups"
                    />
                  </h2>
                </div>
              </div>
              <div className="mb-16 mt-16">
                <Grid container className="flex-wrap flex flex-row mb-6">
                  <div className="flex-wrap flex flex-row justify-center text-center">
                    {groupObj &&
                      groupObj !== null &&
                      groupObj.array &&
                      groupObj.array[0] !== undefined &&
                      groupObj.array.map((group, id) => (
                        <Grid
                          item
                          key={id}
                          sm={6}
                          md={4}
                          lg={4}
                          className={`sm:flex-grow-0 sm:w-1/3 w-1/2${classes.flexBasis}`}
                        >
                          <div>
                            <div
                              style={{ cursor: 'pointer' }}
                              onClick={e => {
                                //   try {
                                //     window.mParticle.logEvent(
                                //       EventName.GroupLinkClick,
                                //       window.mParticle.EventType.Navigation,
                                //       {
                                //         [PageField.UrlHost]:
                                //           window.location.hostname,
                                //         [SlugField.GroupId]: group.id,
                                //         [SlugField.GroupName]: group.name
                                //       }
                                //     );
                                //   } catch (error) {
                                //     console.warn(
                                //       'caught error sending mparticle event',
                                //       error
                                //     );
                                //   }
                                this.setState({
                                  openPopUp: true,
                                  currentGroupName: group.name,
                                  currentGroupId: group.id
                                });
                              }}
                            >
                              <div className="text-center">
                                <div className="text-center">
                                  {/* <img alt="card_image" src={group.image ? group.image.medium : MissingImage} height={200} width={200} /> */}
                                  <img
                                    alt={`${group.name} meditation group cover`}
                                    src={`${process.env.REACT_APP_GROUP_IMAGE}/${group.id}%2Fpictures%2Fsquare_medium.jpeg?alt=media`}
                                    onError={e => {
                                      e.target.src = MissingImage;
                                    }}
                                    height={200}
                                    width={200}
                                    className="h-48 m-auto rounded-full"
                                  />
                                </div>
                              </div>
                              <div
                                style={{ cursor: 'pointer' }}
                                onClick={e => {
                                  // try {
                                  //   window.mParticle.logEvent(
                                  //     EventName.GroupLinkClick,
                                  //     window.mParticle.EventType.Navigation,
                                  //     {
                                  //       [PageField.UrlHost]:
                                  //         window.location.hostname,
                                  //       [SlugField.GroupId]: group.id,
                                  //       [SlugField.GroupName]: group.name
                                  //     }
                                  //   );
                                  // } catch (error) {
                                  //   console.warn(
                                  //     'caught error sending mparticle event',
                                  //     error
                                  //   );
                                  // }
                                  this.setState({
                                    openPopUp: true,
                                    currentGroupName: group.name,
                                    currentGroupId: group.id
                                  });
                                }}
                              >
                                <h5 className="font-ProxiSemibold text-it-lightgreen text-base mt-6 mb-2">
                                  {group.name}
                                </h5>
                                <h6 className="font-ProxiRegular mb-6">
                                  <FormattedHTMLMessage
                                    id="meditation_groups.xxx_member"
                                    defaultMessage={`{members} members`}
                                    values={{
                                      members: group.member_count
                                        ? numberConvert(group.member_count)
                                        : 0
                                    }}
                                  />
                                </h6>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      ))}
                  </div>
                </Grid>
              </div>

              <div className="row mb-16 text-center">
                <div className="col">
                  <div className="mb-10">
                    <Button
                      color="primary"
                      className={
                        pageNumber === 0 || pageNumber === undefined
                          ? 'bg-transparent text-black14'
                          : ''
                      }
                      disabled={
                        !!(pageNumber === 0 || pageNumber === undefined)
                      }
                      to={`/meditation-groups?${slug ? `&topic=${slug}` : ''}`}
                      component={NavLink}
                    >
                      First
                    </Button>
                    <Button
                      color="primary"
                      className={
                        pageNumber <= 0 ? 'bg-transparent text-black14' : ''
                      }
                      disabled={pageNumber <= 0}
                      to={`/meditation-groups?page=${pageNumber - 1}${
                        slug ? `&topic=${slug}` : ''
                      }`}
                      component={NavLink}
                    >
                      Prev
                    </Button>
                    <Button
                      color="primary"
                      className={
                        pageNumber >= totalPageCount
                          ? 'bg-transparent text-black14'
                          : ''
                      }
                      disabled={pageNumber >= totalPageCount}
                      to={`/meditation-groups?page=${pageNumber + 1}${
                        slug ? `&topic=${slug}` : ''
                      }`}
                      component={NavLink}
                    >
                      Next
                    </Button>
                    <Button
                      color="primary"
                      className={
                        pageNumber >= totalPageCount
                          ? 'bg-transparent text-black14'
                          : ''
                      }
                      disabled={pageNumber >= totalPageCount}
                      to={`/meditation-groups?page=${totalPageCount}${
                        slug ? `&topic=${slug}` : ''
                      }`}
                      component={NavLink}
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Modal
            open={openPopUp}
            onBackdropClick={() => {
              this.setState({ openPopUp: false });
            }}
          >
            <div
              className="relative border-none shadow-none margin-auto outline-none focus:border-none focus:shadow-none focus:outline-none"
              style={{ maxWidth: '500px', height: '580px' }}
            >
              <AppDownload
                titleMeditationGroup={`Download the app to join ${currentGroupName}`}
                descriptionMeditationGroup={`Home to more than ${
                  meditators
                    ? meditators
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : '6,300,000'
                } meditators, Insight Timer is rated as the top free meditation app on the Android and IOS stores.`}
              />
            </div>
          </Modal>
        </div>
        <div className="mt-30">
          <Footer />
        </div>
      </div>
    );
  }

  handleClose = () => {
    this.setState({
      openPopUp: false
    });
  };

  componentWillMount() {
    const { location } = this.props;
    const queryObject = queryString.parse(location.search);
    const page = queryObject.page ? queryObject.page : 0;
    this.fillData(page);

    // load global stats
    api
      .getGlobalStats()
      .then(resp => {
        this.setState({ ...this.state, ...resp });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  componentWillReceiveProps(newProps) {
    const { location } = newProps;
    const queryObject = queryString.parse(location.search);
    const page = queryObject.page ? queryObject.page : 0;
    this.fillData(page);
  }
}
MeditationGroups = injectIntl(MeditationGroups);
export default withStyles(styles)(MeditationGroups);
