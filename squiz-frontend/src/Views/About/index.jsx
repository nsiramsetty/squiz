import Container from '@material-ui/core/Container';
import * as gtm from 'api/gtm';
import AboutChart from 'Assets/images/page_about/about_chart.png';
import AddMetaDescription from 'components/AddMetaDescription';
import Footer from 'components_2/footer';
import { PageTypes } from 'lib/mparticle/enums';
import * as mparticle from 'lib/mparticle/loggers';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

class About extends Component {
  render() {
    const title = this.props.intl.formatMessage({
      id: 'about.title'
    });
    return (
      <>
        <Container maxLength="lg" className="pt-8">
          <AddMetaDescription>
            <title>About | Insight Timer</title>
            <meta name="description" content={title} />
            <meta
              name="keywords"
              content="meditation timer, insight timer, zen timer, free guided meditation, meditation courses"
            />
            <meta name="author" content="Insight Network, Inc." />
            <meta
              name="copyright"
              content="Insight Network, Inc. Copyright (c) 2019"
            />

            <meta property="og:description" content={title} />
            <meta property="og:type" content="website" />
            <meta
              property="og:image"
              content="https://publicdata.insighttimer.com/public/images/bell_icon_big.png?1544064907"
            />
            <meta property="og:image:width" content="200" />
            <meta property="og:image:height" content="200" />
            <meta property="og:url" content="https://insighttimer.com/about" />
            <meta property="og:title" content="About | Insight Timer" />

            <link rel="canonical" href="https://insighttimer.com/about" />
          </AddMetaDescription>

          <div className="m-auto">
            <h1 className="font-ProxiSemibold w-7/8 md:w-1/2 w-4/5 mx-auto mt-6 mb-6 sm:mt-12 sm:mb-8 text-3xl sm:text-4xl text-center text-grey_48">
              {title}
            </h1>
          </div>

          <div className="text-justify w-7/8 md:w-2/3 m-auto text-xl text-it-lightgrey my-12">
            <p className="m-auto">
              Twelve months ago we started the long journey towards becoming a
              sustainable company. Our business plan says we have two years to
              go but I often lay awake at night wondering if we’ll get there at
              all… other meditation apps outspend us a gazillion to 1.
            </p>
          </div>

          <div className="mx-auto my-8 w-7/8 md:w-1/2 text-center">
            <img
              className="mx-auto"
              src={AboutChart}
              alt="time spent meditating on insight timer app pie chart green"
            />
          </div>

          <div className="text-xl text-it-lightgrey w-7/8 md:w-2/3 text-justify mx-auto mt-12 mb-24">
            <p className="my-4">
              Every now and then we come across something #mindblowing which
              reminds us of why we do what we do. So we inhale deeply and take
              the next step.
            </p>
            <p className="my-4">
              This chart shows how much time is spent on Insight Timer compared
              with many other meditation apps who you often read about in the
              media.
            </p>
            <p className="my-4">
              Usually the journalists write about how many downloads these apps
              have, or how much funding they’ve raised, or how much money
              they’re making. Rarely do they write about how many of the
              downloads convert to meditators, or how much time people spend on
              them, or how often people return each week — ‘metrics’ that
              actually matter when nurturing a meditation practice.
            </p>
            <p className="my-4">
              I realise now that it’s up to us to tell our story. We can’t wait
              any longer. So here I am doing exactly that, telling our story
              with a pie chart.{' '}
              <span aria-label="it-happy" role="img">
                🤓
              </span>
            </p>
            <p className="my-4">
              If we’re going to make it through the next part of journey,
              Insight Timer needs to grow. Our 6 million meditators need to
              become 50 million. And even though just a small percentage of our
              community will subscribe to our{' '}
              <Link
                className="text-it-lightgreen"
                // onClick={e =>
                //   mparticle.logClickEvent(PageType.Premium, '/premium')
                // }
                to="/premium"
              >
                paid features
              </Link>
              , they will be enough for Insight Timer and our{' '}
              <Link
                // onClick={e =>
                //   mparticle.logClickEvent(
                //     PageType.TeacherLanding,
                //     '/meditation-teachers'
                //   )
                // }
                to="/meditation-teachers"
              >
                3000 teachers
              </Link>{' '}
              to live sustainably.
            </p>
            <p className="my-4">
              And 48 million people will have access to a free daily meditation
              practice. So today I’m also asking for your help.
            </p>
            <p className="my-4">
              1. If you know any journalists who’d like to break a #bigstory
              about a small team,{' '}
              <Link
                className="text-it-lightgreen"
                // onClick={e =>
                //   mparticle.logClickEvent(
                //     PageType.MediaEnquiries,
                //     '/media-enquiries'
                //   )
                // }
                to="/media-enquiries"
              >
                come find me here
              </Link>
              . I have lots more to say about our little red caboose{' '}
              <span aria-label="it-train" role="img">
                🚂
              </span>
            </p>
            <p className="my-4">
              2. If you know any influencers who can help us get our story out
              there please share this with them. Better still, share this chart
              and this article on social media and hashtag #freemeditation
            </p>
            <p className="my-4">
              3. Or next time someone asks you about meditation apps, reply with
              this question; ‘Did you know that people spend almost 3x more time
              on Insight Timer than many other apps who have 10 times more
              downloads and a bazillion times more revenue?’.
            </p>
            <p className="my-4">Thank you for sharing.</p>
            <p className="my-4">
              We can do this. One person at a time. But not without you.
            </p>
            <p className="my-4">
              Christopher Plowman <br />
              CEO Insight Timer
            </p>
          </div>
        </Container>

        <Footer />
      </>
    );
  }

  componentDidMount() {
    mparticle.logPageViewed(this.props.location, PageTypes.About);
    gtm.pushDataLayer({
      event: 'virtual_page_view',
      pageTitle: `About | Insight Timer`,
      pageUrl: this.props.location.pathname,
      pageQuery: this.props.location.search
    });
  }
}

export default injectIntl(About);
