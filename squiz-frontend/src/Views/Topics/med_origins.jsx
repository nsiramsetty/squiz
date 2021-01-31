import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as gtm from 'api/gtm';
import * as api from 'api/insight';
import classNames from 'classnames';
import AddMetaDescription from 'components/AddMetaDescription';
import Footer from 'components_2/footer';
import $ from 'jquery';
import { PageTypes } from 'lib/mparticle/enums';
import * as mparticle from 'lib/mparticle/loggers';
import find from 'lodash/find';
import React, { Component } from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import * as topicsApi from './resources/apiCalls';
import ChipsRender from './resources/ChipsRender';
import { TopicFilterLoader } from './TopicsLoader';

const styles = theme => ({
  chip: {
    marginRight: '10px',
    marginTop: '10px',
    backgroundColor: 'rgba(25,121,121,0.10)',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#0F797A',
    cursor: 'pointer'
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '38px',
      marginRight: '38px'
    }
  }
});

class MeditationOrigins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoader: false,
      topicsArray: [],
      isOpen: false,
      meditators: 0,
      slug: 'Origins'
    };
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    });
  };

  fillData = slug => {
    this.setState({ pageLoader: true });
    if (slug !== undefined && slug.trim()) {
      topicsApi
        .getStaticTopic(slug)
        .then(resp => {
          this.setState({
            pageLoader: false,
            topicsArray: resp.topics
          });
        })
        .catch(err => {
          console.warn(err);
          this.setState({
            pageLoader: false,
            topicsArray: []
          });
        });
    }
    api
      .getGlobalStats()
      .catch(err => null)
      .then(stats => {
        this.setState({
          totalMeditations: (stats && stats.meditators) || 0,
          totalTeachers: stats && stats.teachers
        });
      });
  };

  getTitle = () => {
    return {
      title: this.props.intl.formatMessage({ id: 'mediation.origins.title' }),
      description: this.props.intl.formatMessage({
        id: 'mediation.origins.description'
      })
    };
  };

  render() {
    const { pageLoader, topicsArray } = this.state;
    const { classes } = this.props;
    let traditions = null;
    let sciences = null;
    let concepts = null;
    if (topicsArray && topicsArray.length > 0) {
      traditions =
        find(topicsArray, { name: 'Traditions' }) &&
        find(topicsArray, { name: 'Traditions' }).children;
      sciences =
        find(topicsArray, { name: 'Sciences' }) &&
        find(topicsArray, { name: 'Sciences' }).children;
      concepts =
        find(topicsArray, { name: 'Concepts' }) &&
        find(topicsArray, { name: 'Concepts' }).children;
    }

    const meta = this.getTitle();

    const urlStart = `meditation-origins`;

    return (
      <>
        <AddMetaDescription>
          <title>{meta.title}</title>
          <meta property="og:type" content="website" />
          <meta property="og:description" content={meta.description} />
          <meta
            property="og:image"
            content="https://publicdata.insighttimer.com/public/images/bell_icon_big.png?1544064907"
          />
          <meta property="og:image:width" content="200" />
          <meta property="og:image:height" content="200" />
          <meta
            property="og:url"
            content={`https://insighttimer.com/${urlStart}`}
          />
          <meta property="og:title" content={meta.title} />
          <meta name="description" content={meta.description} />
          <meta
            name="keywords"
            content="meditation timer, insight timer, zen timer, guided meditation"
          />
          <link rel="canonical" href={`https://insighttimer.com/${urlStart}`} />
        </AddMetaDescription>
        {pageLoader ? (
          <TopicFilterLoader />
        ) : (
          <div id="topic-origins-main" className="pt-40">
            <div>
              <div className={classNames(classes.layout)}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div
                      ref={'origins'}
                      id={'origins'}
                      className="it-topic-groups"
                    >
                      <div className="mb-20">
                        <h1
                          id="topic-origins-main-header"
                          className="font-ProxiBold text-2xl text-black75 mb-4"
                        >
                          <FormattedHTMLMessage
                            id="mediation.origins.heading"
                            defaultMessage={`The Origins of Meditation`}
                          />
                        </h1>
                        <p
                          id="topic-origins-main-description"
                          className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_"
                        >
                          <FormattedHTMLMessage
                            id={`mediation.origins.heading.paragraph1`}
                            defaultMessage="There is no brief history of meditation. Our teachers hail from all corners of the globe. As leaders in their area of expertise, their knowledge and teachings go deep within the fields of spirituality, religion and psychology. Some are secular, others are far from it. There is not just one origin of meditation; its roots travel back to ancient times and have developed into many forms of meditation practices used by millions of people from different belief systems and nationalities."
                          />
                        </p>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                          <FormattedHTMLMessage
                            id="mediation.origins.heading.paragraph2"
                            defaultMessage={`This overview pins down the main origins of meditation practices that are as diverse as their practitioners. `}
                          />
                        </p>
                        <h2 className="font-ProxiBold text-2xl text-black75 my-4">
                          <FormattedHTMLMessage
                            id="mediation.origins.subheading"
                            defaultMessage={`The Origin of Meditation: Secular and Religious, Scientific and Spiritual`}
                          />
                        </h2>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={traditions}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4">
                            <FormattedHTMLMessage
                              id="mediation.origins.traditions"
                              defaultMessage={`Traditions`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.origins.traditions.paragraph"
                              defaultMessage={`Different cultures and religions of the world have developed manifold traditional meditation practices. It is believed that the earliest meditation practice dates back to the ancient Hindu tradition Vedantism 1500 B.C. In the West, meditative practices were first mentioned in Jewish writings. These teachings especially focused on the meditative approach during prayer. The diversity of traditional origins is reflected in our free meditation library. Explore thousands of guided meditations from these traditions:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={sciences}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4">
                            <FormattedHTMLMessage
                              id="mediation.origins.sciences"
                              defaultMessage={`Sciences`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.origins.sciences.paragraph"
                              defaultMessage={`Science meets meditation: Scientific fields such as Psychology and Neuroscience have brought religious and spiritual practices to secular perspectives. The first physiological studies on meditation took place in the 1950s. Since then, meditation research has expanded into many scientific fields and given us insight into how the brain is affected by meditation practices. Research keeps discovering more and more benefits such as stress reduction, lengthening attention span and improving sleep quality. Explore guided practices from these scientific origins of meditation:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={concepts}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4">
                            <FormattedHTMLMessage
                              id="mediation.origins.concepts"
                              defaultMessage={`Concepts`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.origins.concepts.paragraph1"
                              defaultMessage={`Established world theories also evolved meditation practices. Browse through popular conceptual meditation practices:`}
                            />
                          </p>
                        </ChipsRender>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_ mt-8">
                          <FormattedHTMLMessage
                            id="mediation.origins.concepts.paragraph2"
                            defaultMessage={`This list of origins of meditation is not finalised — it will never be. New practices can develop at any time in any culture. Meditation is mainly a personal experience and exploration. Individuals keep evolving new practices that will be passed on by generations. This overview show what an important integral part meditation has been playing in the evolvement of humanity. Get an overview of ${(
                              <a
                                className="it-text-underline"
                                href="https://insighttimer.com/meditation-benefits"
                              >
                                the benefits of meditation
                              </a>
                            )} and find the ideal practice for your needs and desires.`}
                          />
                        </p>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                          <FormattedHTMLMessage
                            id="mediation.origins.concepts.paragraph3"
                            defaultMessage={`Get an overview of the benefits of meditation and find the ideal practice for your needs and desires.`}
                          />
                        </p>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>

              <Footer />
            </div>
          </div>
        )}
      </>
    );
  }

  componentWillMount() {
    const slug = 'ORIGINS';
    this.fillData(slug);
  }

  componentDidMount() {
    const meta = this.getTitle();

    mparticle.logPageViewed(this.props.location, PageTypes.MeditationOrigins);

    gtm.pushDataLayer({
      event: 'virtual_page_view',
      pageTitle: meta.title,
      pageUrl: this.props.location.pathname,
      pageQuery: this.props.location.search
    });

    $('.it-header-wrap').addClass('it-white-header it-courese-header');
    $(document).ready(function() {
      let scroll_pos = 0;
      $(document).scroll(() => {
        scroll_pos = $(this).scrollTop();
        if (scroll_pos > 140) {
          $('.it-header-wrap').addClass('it-header-sticky');
        } else {
          $('.it-header-wrap').removeClass('it-header-sticky');
        }
      });
    });
  }

  componentWillUnmount() {
    $('.it-header-wrap').removeClass(
      'it-white-header it-courese-header it-header-sticky'
    );
    $(document).unbind('scroll');
  }
}

MeditationOrigins = injectIntl(MeditationOrigins);
export default withStyles(styles)(MeditationOrigins);
