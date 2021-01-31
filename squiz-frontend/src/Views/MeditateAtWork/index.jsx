import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import * as gtm from 'api/gtm';
import AddMetaDescription from 'components/AddMetaDescription';
import Footer from 'components_2/footer';
import $ from 'jquery';
import { PageTypes } from 'lib/mparticle/enums';
import * as mparticle from 'lib/mparticle/loggers';
import React, { Component } from 'react';

const styles = theme => ({
  layout_narrow: {
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
  meditateWork_header: {
    fontSize: '40px',
    textAlign: 'center',
    lineHeight: '50px',
    color: '#414141'
  },
  meditateWork_p: {
    marginBottom: '56px',
    color: '#5c5c5c',
    fontSize: '24px'
  },

  meditateWork_h3: {
    marginTop: '56px',
    fontSize: '20px'
  },

  downloadBtn: {
    textTransform: 'capitalize',
    height: '220px',
    width: '100%',
    maxWidth: '350px',

    backgroundColor: '#ddd',
    fontSize: '30px',
    padding: '24px',
    paddingTop: '20px',
    borderRadius: 0,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#197979',
      color: '#fff!important',

      '& $onHoverNone': {
        display: 'none!important'
      },
      '& $onHoverShow': {
        display: 'inline!important'
      },

      '& $textToWhite': {
        color: 'white!important'
      }
    }
  },

  onHoverNone: {
    display: 'inline',
    height: 'auto'
  },

  onHoverShow: {
    display: 'none',
    height: 'auto'
  },

  textToWhite: {
    flex: '1 1 100%'
  }
});

class MeditateAtWork extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.layout_narrow}>
          <AddMetaDescription>
            <title>Meditation at Work | Insight Timer</title>
            <meta
              name="description"
              content="Meditation has a wide range of proven benefits. Often overlooked is the impact it can have on workplace culture. While culture is complex and different for every team, meditation can be a great tool to keep improving it over time."
            />
            <meta
              name="keywords"
              content="insight timer, meditation at work, workplace culture, proven benefits, team poster"
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:description"
              content="Meditation has a wide range of proven benefits. Often overlooked is the impact it can have on workplace culture. While culture is complex and different for every team, meditation can be a great tool to keep improving it over time."
            />
            <meta
              property="og:image"
              content="https://publicdata.insighttimer.com/public/images/bell_icon_big.png?1544064907"
            />
            <meta property="og:image:width" content="200" />
            <meta property="og:image:height" content="200" />
            <meta
              property="og:url"
              content="https://insighttimer.com/meditate-at-work"
            />
            <meta
              property="og:title"
              content="Meditation at Work | Insight Timer"
            />

            <link
              rel="canonical"
              href="https://insighttimer.com/meditate-at-work"
            />
          </AddMetaDescription>
          <div className="container mt-20 mb-24">
            <h1
              className={`${classes.meditateWork_header} font-ProxiBold mb-6`}
            >
              Meditation at Work
            </h1>
            <p
              className={`${classes.meditateWork_p} text-justify font-ProxiRegular`}
            >
              Meditation has a wide range of proven benefits. Often overlooked
              is the impact it can have on workplace culture. While culture is
              complex and different for every team, meditation can be a great
              tool to keep improving it over time.
            </p>
            <h2 className="text-2xl opacity-75 font-ProxiBold px-2">
              Stress and Anxiety at Work
            </h2>
            <p className="font-ProxiRegular text-xl text-justify px-2 pt-3">
              Thousands of studies have been completed regarding the positive
              impact of meditation on individual feelings of stress and anxiety.
              More recent studies have included the workplace too. According to
              a 2018 paper published by Harvard, using meditation apps at work
              can significantly{' '}
              <a
                className="text-it-lightgreen"
                href="https://hollis.harvard.edu/primo-explore/fulldisplay?docid=TN_ucl10048827&context=PC&vid=HVD2"
              >
                reduce distress and job strain, whilst increasing levels of
                wellbeing
              </a>
              . Workplaces can be a challenging environment, but having a team
              which encourages daily meditation can help to set the right
              intention for the rest of the employees.
            </p>

            <h2 className="mt-6 opacity-75 font-ProxiBold text-2xl px-2">
              Trust, Transparency and Communication
            </h2>
            <p className="font-ProxiRegular text-xl text-justify px-2 pt-3">
              Meditation during one's day is a useful tool for quieting the
              mind. When teammates know that their colleagues are approaching
              workplace opportunities and challenges from a calm, centred state
              of mind, their level of trust in one another is often elevated.
              Depending on the type of meditation practiced, people can also
              start to become more compassionate and kind to one another.
              According to Ohio State University, even meeting times can be
              reduced when allowing space for{' '}
              <a
                className="text-it-lightgreen"
                href="https://www.sciencedirect.com/science/article/pii/S0889159112004710?via%3Dihub"
              >
                {' '}
                short meditations throughout the day (woo hoo!).
              </a>
            </p>

            <h2 className="mt-6 opacity-75 font-ProxiBold text-2xl px-2">
              Productivity and Creativity
            </h2>
            <p className="font-ProxiRegular text-xl text-justify px-2 pt-3">
              The problem of mental fatigue at work is well documented - here at
              Insight Timer we feel this most around 3pm! But when tiredness
              kicks in, meditation can be a great tool to help your team get a
              boost in energy. This in turn has various positive effects on
              productivity. And when your team gets into a state of “flow”,
              creative sparks will be flying far and wide!
            </p>

            <h2 className="mt-6 opacity-75 font-ProxiBold text-2xl px-2">
              Take Action Today
            </h2>
            <p className="font-ProxiRegular text-xl text-justify px-2 pt-3">
              If your team's culture could be helped with some simple
              meditation, Insight Timer is the most popular meditation app in
              the world with over 15,000 free guided meditations of various
              lengths for all needs and experience levels. We have created a
              poster for you to print and place in your office to start helping
              improve the culture within your team.
            </p>

            <h3
              className={`font-ProxiSemibold opacity-75 pb-4 ${classes.meditateWork_h3}`}
            >
              DOWNLOADS
            </h3>
            <Button
              component="a"
              variant="contained"
              className={`${classes.downloadBtn} group h-full`}
              onClick={() => {
                try {
                  window.mParticle.logEvent(
                    'general_button_clicked_web',
                    window.mParticle.EventType.Navigation,
                    {
                      button_name: 'download_team_poster',
                      domain: window.location.hostname
                    }
                  );
                } catch (error) {
                  console.warn('caught error sending mparticle event', error);
                }
              }}
              href={require('../../Assets/files/Insight_Timer_Team_Poster.pdf')}
            >
              <span
                className={`font-ProxiRegular text-it-lightgreen self-start ${classes.textToWhite}`}
              >
                Team Poster
              </span>
              <span className={classes.onHoverNone}>
                <img
                  src={require('../../Assets/images/icons/download.svg')}
                  alt="Download PDF"
                  width="50px"
                />
              </span>
              <span className={classes.onHoverShow}>
                <img
                  src={require('../../Assets/images/icons/download-white.svg')}
                  alt="Download PDF"
                  width="50px"
                />
              </span>
            </Button>
          </div>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    );
  }

  componentDidMount() {
    mparticle.logPageViewed(this.props.location, PageTypes.MeditateAtWork);
    gtm.pushDataLayer({
      event: 'virtual_page_view',
      pageTitle: 'Meditation at Work | Insight Timer',
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

export default withStyles(styles)(MeditateAtWork);
