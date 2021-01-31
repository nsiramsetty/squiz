import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Footer from 'components_2/footer';
import React, { Component } from 'react';
import AddMetaDescription from 'components/AddMetaDescription';

const styles = theme => ({
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
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '24px',
      marginRight: '24px'
    }
  },
  CookiePolicyMainWrapper: {
    margin: 0,
    marginTop: '10px',
    color: '#0a0a0a'
  },
  CookiePolicyMainHeader: {
    fontSize: '40px',
    lineHeight: '40px',
    margin: '40px auto 60px auto',
    textAlign: 'center'
  },
  CookiePolicySubSectionWrapper: {
    width: '100%'
  },
  CookiePolicySubSectionList: {
    padding: 0
  },
  CookiePolicySubSectionMainTitleText: {
    fontSize: '18px',
    lineHeight: '32px',
    listStyleType: 'inherit'
  },
  CookiePolicySubSectionListItem: {
    display: 'table',
    counterIncrement: 'item',
    marginBottom: '30px',
    lineHeight: '32px',
    fontSize: '18px',
    '&:before': {
      content: 'counters(item, ".") ". "',
      display: 'table-cell',
      paddingRight: '.6em'
    },
    '& ol': {
      padding: 0,
      counterReset: 'item',
      '& $CookiePolicySubSectionListSubItem': {
        display: 'table',
        counterIncrement: 'item',
        margin: '10px 0',
        fontSize: '18px',
        lineHeight: '32px',
        '&:before': {
          content: 'counters(item, ".") " "',
          display: 'table-cell',
          paddingRight: '.6em'
        }
      }
    }
  },
  CookiePolicySubSectionListSubItem: {
    padding: 0
  },
  CookiePolicySubSectionTable: {
    width: '100%',
    marginTop: '12px',
    fontSize: '18px',
    lineHeight: '32px',
    '& thead': {
      backgroundColor: '#ddd',
      border: '1px solid #f1f1f1',
      '& th': {
        border: 'solid 1px #bbb',
        padding: '0.5rem 0.625rem 0.625rem',
        fontWeight: 400
      }
    },
    '& tbody': {
      border: '1px solid #f1f1f1',
      backgroundColor: '#fefefe',
      '& td': {
        border: 'solid 1px #bbb',
        padding: '0.5rem 0.625rem 0.625rem'
      }
    }
  },
  CookiePolicySubSectionListItemLink: {
    color: '#2199e8 !important',
    lineHeight: 'inherit',
    cursor: 'pointer',
    '&:hover': {
      color: '#2199e8 !important'
    }
  }
});

class CookiePolicy extends Component {
  render() {
    const { classes } = this.props;
    console.info('[index.js] this.props ======>', this.props);

    return (
      // <Wrapper>
      <div style={{ paddingTop: '100px' }}>
        <AddMetaDescription>
          <title>Cookie Policy | Insight Timer</title>
          <meta
            name="description"
            content="More time is spent meditating with our Timer than anywhere else. Customise your routine and drift away."
          />
          <meta
            name="keywords"
            content="meditation timer, insight timer, zen timer, guided meditation, meditation teachers"
          />
          <meta name="author" content="Insight Network, Inc." />
          <meta
            name="copyright"
            content="Insight Network, Inc. Copyright (c) 2019"
          />

          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content={`More time is spent meditating with our Timer than anywhere else. Customise your routine and drift away.`}
          />
          <meta
            property="og:image"
            content="https://publicdata.insighttimer.com/public/images/bell_icon_big.png?1544064907"
          />
          <meta property="og:image:width" content="200" />
          <meta property="og:image:height" content="200" />
          <meta
            property="og:url"
            content={`https://insighttimer.com/cookie-policy`}
          />
          <meta property="og:title" content="Cookie Policy | Insight Timer" />

          <link
            rel="canonical"
            href={`https://insighttimer.com/cookie-policy`}
          />
        </AddMetaDescription>
        <div className={classes.layout}>
          <Grid
            container
            direction="column"
            className={classes.CookiePolicyMainWrapper}
          >
            <Grid item xs={12}>
              <h1
                className={classNames(
                  classes.CookiePolicyMainHeader,
                  'ff-HelveticaNeue-Regular'
                )}
              >
                Cookie Policy
              </h1>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.CookiePolicySubSectionWrapper}
            >
              <Grid item xs={12}>
                <h2
                  className={classNames(
                    'ff-HelveticaNeue-Bold',
                    classes.CookiePolicySubSectionMainTitleText
                  )}
                >
                  INFORMATION ABOUT OUR USE OF COOKIES
                </h2>

                <ol className={classes.CookiePolicySubSectionList}>
                  <li
                    className={classNames(
                      classes.CookiePolicySubSectionListItem,
                      'ff-HelveticaNeue-Regular'
                    )}
                  >
                    Our application and/or website(s) containing the link to
                    this policy (the "App") uses cookies to distinguish you from
                    other users of our App. This helps us to provide you with a
                    good experience when you browse our App and also allows us
                    to improve our App. By continuing to browse our App, you are
                    agreeing to our use of cookies.
                  </li>
                  <li
                    className={classNames(
                      classes.CookiePolicySubSectionListItem,
                      'ff-HelveticaNeue-Regular'
                    )}
                  >
                    A cookie is a small file of letters and numbers that we
                    store on your browser or the hard drive of your device if
                    you agree. Cookies contain information that is transferred
                    to your device's hard drive.
                  </li>
                  <li
                    className={classNames(
                      classes.CookiePolicySubSectionListItem,
                      'ff-HelveticaNeue-Regular'
                    )}
                  >
                    We use the following cookies:
                    <ol>
                      <li
                        className={classNames(
                          'ff-HelveticaNeue-Regular',
                          classes.CookiePolicySubSectionListSubItem
                        )}
                      >
                        <strong>Strictly necessary cookies.</strong>
                        These are cookies that are required for the operation of
                        our App. They include, for example, cookies that enable
                        you to log into secure areas of the App for example your
                        account, use a shopping cart or make use of e-billing
                        services.
                      </li>
                      <li
                        className={classNames(
                          'ff-HelveticaNeue-Regular',
                          classes.CookiePolicySubSectionListSubItem
                        )}
                      >
                        <strong>Analytical/performance cookies.</strong>
                        They allow us to recognise and count the number of
                        visitors and to see how visitors move around our App
                        when they are using it. This helps us to improve the way
                        our App works, for example, by ensuring that users are
                        finding what they are looking for easily.
                      </li>
                      <li
                        className={classNames(
                          'ff-HelveticaNeue-Regular',
                          classes.CookiePolicySubSectionListSubItem
                        )}
                      >
                        <strong>Functionality cookies.</strong>
                        These cookies are used to enable us to identify you as
                        an existing visitor or account holder when you return to
                        our App. This enables us to personalise our content for
                        you, greet you by name and remember your preferences
                        (for example, your choice of language or region).
                      </li>
                      <li
                        className={classNames(
                          'ff-HelveticaNeue-Regular',
                          classes.CookiePolicySubSectionListSubItem
                        )}
                      >
                        <strong>Targeting cookies.</strong>
                        These cookies record your visit to our App, the pages
                        landed on and browsed by you, and the links you have
                        followed. We will use this information to make our App
                        and the advertising displayed on it more relevant to
                        your interests. We may also share this information with
                        third parties for this purpose.
                      </li>
                    </ol>
                  </li>
                  <li
                    className={classNames(
                      classes.CookiePolicySubSectionListItem,
                      'ff-HelveticaNeue-Regular'
                    )}
                  >
                    <p>
                      You can find more information about the individual cookies
                      we use and the purposes for which we use them in the table
                      below:
                    </p>
                    <strong>Essential Cookies</strong>
                    <p>
                      These cookies will be automatically deployed onto your
                      computer when you use the App:{' '}
                    </p>
                    <table
                      className={classNames(
                        classes.CookiePolicySubSectionTable,
                        'ff-HelveticaNeue-Regular'
                      )}
                    >
                      <thead>
                        <tr>
                          <th>Cookie Name</th>
                          <th>Purpose of Cookie and Information Collected</th>
                          <th>Cookie Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>user_credentials</td>
                          <td>Login details of the current user</td>
                          <td>2 years</td>
                        </tr>
                        <tr>
                          <td>_app1_session</td>
                          <td>Last completed action of user</td>
                          <td>1 year</td>
                        </tr>
                        <tr>
                          <td>Stripe payments</td>
                          <td>
                            Cookies belonging to the Stripe online payment
                            gateway
                          </td>
                          <td>2 years</td>
                        </tr>
                      </tbody>
                    </table>

                    <strong>Non-Essential Cookies</strong>
                    <p>
                      These cookies will be offered to you when you use the App
                      – you may accept or decline them depending on whether you
                      are happy for them to be deployed onto your computer or
                      not.{' '}
                    </p>

                    <table
                      className={classNames(
                        classes.CookiePolicySubSectionTable,
                        'ff-HelveticaNeue-Regular'
                      )}
                    >
                      <thead>
                        <tr>
                          <th>Cookie Name</th>
                          <th>Purpose of Cookie and Information Collected</th>
                          <th>Cookie Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Google Analytics</td>
                          <td>Event tracking for analytics</td>
                          <td>2 years</td>
                        </tr>
                        <tr>
                          <td>Mparticle</td>
                          <td>Event tracking for analytics</td>
                          <td>2 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                  <li
                    className={classNames(
                      classes.CookiePolicySubSectionListItem,
                      'ff-HelveticaNeue-Regular'
                    )}
                  >
                    Please note that third parties (including, for example,
                    payment service providers, advertising networks and
                    providers of external services like web traffic analysis
                    services) may also use cookies, over which we have no
                    control. These cookies are likely to be
                    analytical/performance cookies or targeting cookies.
                  </li>
                  <li
                    className={classNames(
                      classes.CookiePolicySubSectionListItem,
                      'ff-HelveticaNeue-Regular'
                    )}
                  >
                    You may block cookies by activating the setting on your
                    browser that allows you to refuse the setting of all or some
                    cookies. Alternatively, you can visit
                    <a
                      className={classes.CookiePolicySubSectionListItemLink}
                      rel="noopener noreferrer"
                      href="http://www.allaboutcookies.org"
                      target="blank_"
                    >
                      {' '}
                      www.allaboutcookies.org{' '}
                    </a>
                    which provides general information about cookies and how you
                    can manage cookies on your computer. Please note that if you
                    use your browser settings to block all cookies (including
                    essential cookies) you may not be able to access all or
                    parts of our App.
                  </li>
                </ol>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CookiePolicy);
