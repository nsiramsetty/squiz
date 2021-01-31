import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as gtm from 'api/gtm';
import * as api from 'api/insight';
import classNames from 'classnames';
import AddMetaDescription from 'components/AddMetaDescription';
import Footer from 'components_2/footer';
// import Wrapper from 'components_old/Wrapper';
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
    marginBottom: '10px',
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
    marginTop: '150px',
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

class MeditationBenefits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoader: false,
      topicsArray: [],
      isOpen: false,
      meditators: 0,
      slug: 'Benefits'
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
      title: this.props.intl.formatMessage({ id: 'mediation.benefits.title' }),
      description: this.props.intl.formatMessage({
        id: 'mediation.benefits.description'
      })
    };
  };

  render() {
    const { pageLoader, topicsArray } = this.state;
    const { classes } = this.props;
    let recovery_healing = [];
    let stress_anxiety = [];
    let performance = [];
    let relationships = [];
    let spiritual = [];
    let kids_teens = [];

    if (topicsArray && topicsArray.length > 0) {
      recovery_healing = find(topicsArray, { topic: 'recoveryhealing' })
        .children;
      stress_anxiety = find(topicsArray, { topic: 'stressanxiety' }).children;
      performance = find(topicsArray, { topic: 'creativityperformance' })
        .children;
      // wellbeing = find(topicsArray, { topic: "wellbeing" }).children;
      relationships = find(topicsArray, { topic: 'relationships' }).children;
      spiritual = find(topicsArray, { topic: 'spiritual' }).children;
      kids_teens = find(topicsArray, { topic: 'children' }).children;
    }

    const meta = this.getTitle();

    const urlStart = `meditation-benefits`;

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
          <div
            id="topic-benefits-main"
            className="it-topic-filter-main-wrapper"
          >
            <div>
              <div className={classNames(classes.layout)}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div ref={'benefits'} id={'benefits'}>
                      <div className="mb-8">
                        <h1
                          id="topic-benefits-main-header"
                          className="font-ProxiBold text-2xl text-grey_ mb-4"
                        >
                          <FormattedHTMLMessage
                            id="mediation.benefits.heading"
                            defaultMessage={`Benefits of Meditation`}
                          />
                        </h1>
                        <p
                          id="topic-benefits-main-description"
                          className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_"
                        >
                          <FormattedHTMLMessage
                            id="+-"
                            defaultMessage={`People start meditating for many reasons. Some are seeking inner peace and happiness. Other hope to achieve greater levels of compassion and gratitude. And some need help with focusing, motivation or sleeping. The benefits of meditation are manifold. And so are the forms and types of meditation. Benefits such as stress reduction, recovering from addiction and relieving anxiety have been proven by many scientific researches.`}
                          />
                        </p>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                          <FormattedHTMLMessage
                            id="mediation.benefits.heading.paragraph2"
                            defaultMessage={`Meditation is an individual experience. We all have our crosses to bear. Understanding our individual needs helps to find the right meditation practice we can truly benefit from.`}
                          />
                        </p>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                          <FormattedHTMLMessage
                            id="mediation.benefits.heading.paragraph3"
                            defaultMessage={`Insight Timer offers the world’s largest meditation library including thousands of practices for a wide range of benefits. Explore this detailed collection and find the right guidances for your needs.`}
                          />
                        </p>
                        <h2 className="font-ProxiBold text-2xl text-grey_ my-4">
                          <FormattedHTMLMessage
                            id="mediation.benefits.subheading"
                            defaultMessage={`What are the benefits of meditation?`}
                          />
                        </h2>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={recovery_healing}
                        >
                          <h3 className="font-ProxiBold text-xl text-grey_ my-4 opacity-75">
                            <FormattedHTMLMessage
                              id={`mediation.benefits.recovery&healing`}
                              defaultMessage={`Recovery & Healing`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id={`mediation.benefits.recovery&healing.paragraph`}
                              defaultMessage={`Whenever someone suffers from physical or mental pain, regular meditation can be a source for support, refuge and healing wounds and help to connect again with the mind and body. Meditation practices can free people from addictive patterns. Explore these catalogues of guided meditations, music and talks that employ techniques from mindful awareness to self inquiry:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={stress_anxiety}
                        >
                          <h3 className="font-ProxiBold text-xl text-grey_ my-4 opacity-75">
                            <FormattedHTMLMessage
                              id={`mediation.benefits.stress&anxiety`}
                              defaultMessage={`Stress & Anxiety`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id={`mediation.benefits.stress&anxiety.paragraph`}
                              defaultMessage={`Meditation provenly lowers stress hormones and helps to connect with the present moment. Meditative practices provide us with emotional resources in order to mindfully sort out and deal with sometimes overwhelming pressure and demands of daily life. Anxious reaction patterns can be rewired and replaced by more mindful and calm actions. Discover helpful advice and guided practices that help to cross through the “fight-or-flight”-response and to deal with:`}
                            />
                          </p>
                        </ChipsRender>
                        <>
                          <h3 className="font-ProxiBold text-xl text-grey_ my-4 opacity-75">
                            <FormattedHTMLMessage
                              id="mediation.benefits.sleep"
                              defaultMessage={`Sleep`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id="mediation.benefits.sleep.paragraph"
                              defaultMessage={`Better sleep — one of the main benefits of meditation people are drawn to. Because, from time to time, everyone finds it difficult to switch off the brain at night and fall asleep. Poor sleep quality and restlessness, however, can cause low motivation and energy, reduced focused and productivity, poor memory and fatigueness. But sleep comes easier to a relaxed, allayed and non-alert mind. Meditation naturally activates the relaxation response of the body, helps to let go of distracting thoughts, lets us enter lower brainwave frequencies and boosts our melatonin levels. Discover ${(
                                <a
                                  className="it-text-underline"
                                  href="https://insighttimer.com/meditation-topics/sleep"
                                >
                                  hundreds of free guided sleep meditation
                                  practices
                                </a>
                              )}.`}
                            />
                          </p>
                        </>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={performance}
                        >
                          <h3 className="font-ProxiBold text-xl text-grey_ my-4 opacity-75">
                            <FormattedHTMLMessage
                              id="mediation.benefits.performance"
                              defaultMessage={`Performance`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id="mediation.benefits.performance.paragraph"
                              defaultMessage={`A benefit of meditation is the improvement of focus and therefore clarity. Meditation is like a training for the “brain muscles” and helps to focus and sustain attention. These skills can positively affect coming up with new, creative ideas as well as working in or leading a team. Boost your performance in different fields with guided meditations for:`}
                            />
                          </p>
                        </ChipsRender>
                        {/* <ChipsRender logEvent={mparticle.logClickEvent} pageType={PageType} classes={classes} data={wellbeing}>
                                                <h3 className="ff-SF-UI-Display-Bold">
                                                    <FormattedHTMLMessage
                                                        id='mediation.benefits.wellbeing'
                                                        defaultMessage={`Wellbeing`}
                                                    />
                                                </h3>
                                                <p className="ff-SF-UI-Display-Regular">
                                                    <FormattedHTMLMessage
                                                        id='mediation.benefits.wellbeing.paragraph'
                                                        defaultMessage={`Practicing meditation flourishes a more calm, peaceful and balanced mindset which benefits our emotional health . It does not just lower our stress levels but also helps to gently accept and then let go of difficult feelings and emotions. Browse through guided meditation practices that benefit your wellbeing:`}
                                                    />
                                                </p>
                                            </ChipsRender> */}
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={relationships}
                        >
                          <h3 className="font-ProxiBold text-xl text-grey_ my-4 opacity-75">
                            <FormattedHTMLMessage
                              id="mediation.benefits.relationships"
                              defaultMessage={`Relationships`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id="mediation.benefits.relationships.paragraph"
                              defaultMessage={`Daily meditation can deepen our ways of feeling and showing compassion, gratitude and love to ourselves and others. The singular benefits help to build up stronger connections and empathic communication. Discover humane and bonding guided practices for:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={spiritual}
                        >
                          <h3 className="font-ProxiBold text-xl text-grey_ my-4 opacity-75">
                            <FormattedHTMLMessage
                              id="mediation.benefits.spiritual"
                              defaultMessage={`Spiritual`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id="mediation.benefits.spiritual.paragraph"
                              defaultMessage={`People may connect to an inner energy more easily through meditation. A regular practice teaches how to turn inward to the spiritual self for answers and decision-making. Seek and find your Higher Self with guided meditations for:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={kids_teens}
                        >
                          <h3 className="font-ProxiBold text-xl text-grey_ my-4 opacity-75">
                            <FormattedHTMLMessage
                              id="mediation.benefits.kids"
                              defaultMessage={`Kids`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id="mediation.benefits.kids.paragraph1"
                              defaultMessage={`Meditation is a peaceful way to teach children about self-acceptance, resilience, empathy and other aspects of mental strength and health. Mindfulness practices helps kids to develop more self-control and manage challenging behavior patterns. Introducing children to meditation practices will benefit them not just now but in the long run. Discover our large collections offering appropriate guided practices for ${(
                                <a
                                  className="it-text-underline"
                                  href="/#"
                                  rel="nofollow"
                                >
                                  Meditation for Kids
                                </a>
                              )} and, ideal for bedtime, ${(
                                <a
                                  className="it-text-underline"
                                  href="/meditation-topics/children"
                                >
                                  Sleep Meditation for Kids.
                                </a>
                              )}`}
                            />
                          </p>
                          <p className="font-ProxiRegular text-lg text-grey_ leading-relaxed my-4">
                            <FormattedHTMLMessage
                              id="mediation.benefits.kids.paragraph2"
                              defaultMessage={`Follow these diverse benefits of meditation and explore more than 15,000 free guided practices, music tracks and talks. Get an overview of ${(
                                <a
                                  className="it-text-underline"
                                  href="https://insighttimer.com/meditation-practices"
                                >
                                  the origins of meditation
                                </a>
                              )} as well as ${(
                                <a
                                  className="it-text-underline"
                                  href="https://insighttimer.com/meditation-practices"
                                >
                                  the different meditation practices.
                                </a>
                              )}`}
                            />
                          </p>
                        </ChipsRender>
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

  componentDidMount() {
    const slug = 'BENEFITS';
    this.fillData(slug);

    const meta = this.getTitle();
    mparticle.logPageViewed(this.props.location, PageTypes.MeditationBenefits);

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

MeditationBenefits = injectIntl(MeditationBenefits);
export default withStyles(styles)(MeditationBenefits);
