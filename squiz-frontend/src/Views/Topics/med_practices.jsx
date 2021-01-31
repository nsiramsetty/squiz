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

class MeditationPractices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoader: false,
      topicsArray: [],
      isOpen: false,
      meditators: 0,
      slug: 'Practices'
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
      title: this.props.intl.formatMessage({ id: 'mediation.practices.title' }),
      description: this.props.intl.formatMessage({
        id: 'mediation.practices.description'
      })
    };
  };

  render() {
    const { pageLoader, topicsArray } = this.state;
    const { classes } = this.props;
    let sound = [];
    let moment = [];
    let self_observation = [];
    let concentration = [];
    let mindfulness = [];
    let gentle_repetition = [];
    let visualization = [];

    if (topicsArray && topicsArray.length > 0) {
      sound = find(topicsArray, { name: 'Sound' }).children;
      moment = find(topicsArray, { name: 'Movement' }).children;
      self_observation = find(topicsArray, { name: 'Self-Observation' })
        .children;
      concentration = find(topicsArray, { name: 'Concentration' }).children;
      mindfulness = find(topicsArray, { name: 'Mindfulness' }).children;
      gentle_repetition = find(topicsArray, { name: 'Gentle Repetition' })
        .children;
      visualization = find(topicsArray, { name: 'Visualization' }).children;
    }

    const meta = this.getTitle();

    const urlStart = `meditation-practices`;

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
          <div className="mt-40">
            <div>
              <div className={classNames(classes.layout)}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div ref={'practices'} id={'practices'}>
                      <div className="mb-8">
                        <h1
                          id="topic-practices-main-header"
                          className="font-ProxiBold text-2xl text-black75 mb-4"
                        >
                          <FormattedHTMLMessage
                            id="mediation.practices.heading"
                            defaultMessage={`The Different Types of Meditation`}
                          />
                        </h1>
                        <p
                          id="topic-practices-main-description"
                          className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_"
                        >
                          <FormattedHTMLMessage
                            id="mediation.practices.heading.paragraph1"
                            defaultMessage={`There is an important difference between origins and types of meditations. The latter focuses on the main techniques. Many origins have brought forth several practice types. You cannot pin down the diversity of meditation by only outlining the traditions, concepts and scientific fields it has originated from.`}
                          />
                        </p>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                          <FormattedHTMLMessage
                            id="mediation.practices.subheading.paragraph"
                            defaultMessage={`There are hundreds of different meditation practices. These can be categorized into seven broader meditation types. Each has a unique focus of attention. Explore this detailed overview and find your ideal meditation style.`}
                          />
                        </p>
                        <h2 className="font-ProxiBold text-2xl text-grey_ my-4">
                          <FormattedHTMLMessage
                            id="mediation.practices.subheading"
                            defaultMessage={`7 Types of Meditation`}
                          />
                        </h2>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={sound}
                        >
                          <a href="https://insighttimer.com/meditation-music">
                            <h3 className="font-ProxiBold text-xl my-4 text-black50">
                              <FormattedHTMLMessage
                                id="mediation.practices.sound"
                                defaultMessage={`Sound`}
                              />
                            </h3>
                          </a>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.sound.paragraph1"
                              defaultMessage={`Sounds can be the object of our focus just like the breath, wandering thoughts or other body sensations. A mindful and open awareness for sounds can turn the practice of listening into a meditative practice that cultivates a curious and non-judgemental relationship with the sounds. Music-based meditation practices use sound currents and frequencies to calm brainwaves and gently alter the mindset. Explore thousands of meditation practices and exercises that use sound:`}
                            />
                          </p>
                        </ChipsRender>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                          <FormattedHTMLMessage
                            id="mediation.practices.sound.paragraph2"
                            defaultMessage={`Insight Timer is also a platform for musicians and composers to share their soothing and relaxing tunes. ${(
                              <a
                                className="it-text-underline"
                                href="https://insighttimer.com/meditation-music"
                              >
                                Discover our large collection of meditation
                                music
                              </a>
                            )} including nature sounds, binaural beats and ambient sounds.`}
                          />
                        </p>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={moment}
                        >
                          <h3 className="font-ProxiBold text-xl my-4 text-black50">
                            <FormattedHTMLMessage
                              id="mediation.practices.movement"
                              defaultMessage={`Movement`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.movement.paragraph1"
                              defaultMessage={`Sitting or silent meditation is not the ideal practice for everyone. Some might find it easier to dive into a movement meditation that is performed mindfully and at a slow pace. Movement is a type of meditation that lets us experience the sensation of the body. Especially different types of yoga teach and raise the mindful awareness of our muscle’s motions and tensions. Some practices push us to focus our attention on particular body parts such as toes, tailbone, solar plexus and the top of the head. Throughout a yoga flow, practitioners develop a deeper understanding and connection to their body as a whole. Purposeful breathing practices also belong to this energizing category. Movement meditation is a way to mindfully experience gravity and energy as embodied phenomena. `}
                            />
                          </p>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.movement.paragraph2"
                              defaultMessage={`Explore the diverse practices of movement meditation:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={self_observation}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4">
                            <FormattedHTMLMessage
                              id="mediation.practices.self_observation"
                              defaultMessage={`Self-Observation`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.self_observation.paragraph1"
                              defaultMessage={`Different meditation practices focus on peeling back layers and getting in touch with the authentic self. Self-awareness and self-reflection help to mindfully manage difficult emotions and stressful situations.`}
                            />
                          </p>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.self_observation.paragraph2"
                              defaultMessage={`Browse through these self-observing meditation practices:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={concentration}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4 ">
                            <FormattedHTMLMessage
                              id="mediation.practices.concentration"
                              defaultMessage={`Concentration`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.concentration.paragraph1"
                              defaultMessage={`Meditative concentration practices focus on a particular chosen object. The challenge is to focus the mind on this object and to be aware of drifting thoughts. This type of meditation opens a state of mind that is shaped by control, direction and will. Techniques of these practices help to improve consciousness, gain direction and purpose, and take control of and refocus your mind and thoughts:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={mindfulness}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4 ">
                            <FormattedHTMLMessage
                              id="mediation.practices.mindfulness"
                              defaultMessage={`Mindfulness`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.mindfulness.paragraph1"
                              defaultMessage={`Mindfulness are practices that cultivate a non-judgemental awareness of feelings and thoughts. It is the art of noticing when the mind is wandering to the past or future and gently refocusing on the present moment. Mindfulness also means to pay attention to outside situations, such as smells, sounds and touches, and to be aware of what they make you feel. Mindful skills and tools provenly help dealing with stress and anxiety, improving attention and concentration and raising creativity. Focus your awareness on the present moment with the help of these diverse mindfulness practices:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={gentle_repetition}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4">
                            <FormattedHTMLMessage
                              id="mediation.practices.gentle_repetition"
                              defaultMessage={`Gentle Repetition`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.gentle_repetition.paragraph1"
                              defaultMessage={`Repeating a sound or sequence of words can let us enter and deepen the meditative state of mind. Some even say it is the gateway for a focused meditation practice because it helps to keep the mind still. Explore hundreds of guided practices including gentle repetition:`}
                            />
                          </p>
                        </ChipsRender>
                        <ChipsRender
                          //logEvent={mparticle.logClickEvent}
                          //pageType={PageType}
                          classes={classes}
                          data={visualization}
                        >
                          <h3 className="font-ProxiBold text-xl text-black50 my-4 ">
                            <FormattedHTMLMessage
                              id="mediation.practices.visualization"
                              defaultMessage={`Visualization`}
                            />
                          </h3>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.visualization.paragraph1"
                              defaultMessage={`Visualization is an active type of meditation that can be practiced very differently. Guiding our mind and thoughts in specific directions and cultivating positive energy are what they all have in common. The practices are intentional and raise the power of our mind which can positively affect our body. Mental imagery and visualization support inner healing processes and can gradually change behavioral patterns which on the other hand result in attaining desired mindsets, feelings and body sensations. Visualizations can improve outcomes and are often practices by athletes and public speakers in order to manifest their visions and goals.`}
                            />
                          </p>
                          <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                            <FormattedHTMLMessage
                              id="mediation.practices.visualization.paragraph2"
                              defaultMessage={`Focus your mind and add visualization to your daily life by exploring these diverse practice types:`}
                            />
                          </p>
                        </ChipsRender>
                        <p className="font-ProxiRegular text-lg leading-relaxed text-xl text-lightgrey_">
                          <FormattedHTMLMessage
                            id="mediation.practices.visualization.paragraph3"
                            defaultMessage={`The outlined types of meditation do not follow categorizations based on traditions or religions. Learn more about ${(
                              <a
                                className="it-text-underline"
                                href="https://insighttimer.com/meditation-origins"
                              >
                                the origins of meditation{' '}
                              </a>
                            )} to complement your knowledge.`}
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
    const slug = 'PRACTICES';
    this.fillData(slug);
  }

  componentDidMount() {
    const meta = this.getTitle();
    mparticle.logPageViewed(this.props.location, PageTypes.MeditationPractices);

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
MeditationPractices = injectIntl(MeditationPractices);
export default withStyles(styles)(MeditationPractices);
