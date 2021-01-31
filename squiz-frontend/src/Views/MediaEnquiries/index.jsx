import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as gtm from 'api/gtm';
import * as api from 'api/insight';
import AddMetaDescription from 'components/AddMetaDescription';
import Footer from 'components_2/footer';
import { PageTypes } from 'lib/mparticle/enums';
import * as mparticle from 'lib/mparticle/loggers';
import React, { Component } from 'react';
import validator from 'validator';
import LogoZip from '../../Assets/images/logos/Insight-Logo.zip';
import LogoBowl from '../../assets_2/images/logo/appIcon.png';
import { submitMediaQueryForm } from './MediaEnquiriesRepo';

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
  itGridImageContainer_block: {
    height: '82px',
    margiBottom: '20px'
  },
  itGridImg_block: {
    maxWidth: '100%',
    width: '90px',
    height: '52px',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  itTitle_block: {
    fontWeight: '500',
    marginBottom: '7px'
  }
});
const INIT_STATE = {
  enquiriesForm: {
    name: '',
    email: '',
    subject: '',
    message: ''
  },
  valid: {
    name: { status: false, message: '' },
    email: { status: false, message: '' },
    subject: { status: false, message: '' },
    message: { status: false, message: '' }
  },
  formLoader: false,
  pageLoader: false,
  teachers_number: 0,
  meditators_number: 0
};

class MediaEnquiries extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INIT_STATE };
  }

  submitForm = e => {
    e.preventDefault();
    const formState = this.state.enquiriesForm;
    const validState = this.state.valid;
    const keyArray = Object.keys(formState);

    let valid = true;

    keyArray.forEach(name => {
      const value = formState[name];
      let error = false;

      if (validator.isEmpty(value)) {
        validState[name].status = validator.isEmpty(value);
        validState[name].message = `${name} is empty.`;
        valid = false;
        error = true;
      } else {
        if (name === 'email' && !validator.isEmail(value)) {
          validState.email.status = true;
          validState.email.message = 'Email address is not valid.';
          valid = false;
          error = true;
        }

        if (
          name === 'message' &&
          !validator.isLength(value, { min: 20, max: undefined })
        ) {
          validState.message.status = true;
          validState.message.message =
            'Minimum 20 character require in message.';
          valid = false;
          error = true;
        }

        if (!error) {
          validState[name].status = validator.isEmpty(value);
          validState[name].message = '';
        }
      }
    });

    this.setState({
      valid: validState
    });

    if (valid) {
      this.setState({ formLoader: true });
      const data = this.state.enquiriesForm;

      try {
        window.mParticle.logEvent(
          'general_button_clicked_web',
          window.mParticle.EventType.Navigation,
          {
            button_name: 'submit_media_enquiry',
            domain: window.location.hostname
          }
        );
      } catch (error) {
        console.warn('caught error sending mparticle event', error);
      }

      submitMediaQueryForm(data)
        .then(() => {
          this.setState({
            enquiriesForm: {
              name: '',
              email: '',
              subject: '',
              message: ''
            },
            valid: {
              name: { status: false, message: '' },
              email: { status: false, message: '' },
              subject: { status: false, message: '' },
              message: { status: false, message: '' }
            },
            formLoader: false,
            result: 'Enquiry successfully sent!'
          });
        })
        .catch(err => {
          console.warn(err);
          this.setState({
            formLoader: false,
            result: 'Oops! An error occured, please try again later.'
          });
        });
    }
  };

  handleFormChange = name => e => {
    const tempFormState = this.state.enquiriesForm;
    const validState = this.state.valid;
    const { value } = e.target;
    let error = false;
    tempFormState[name] = value;

    if (validator.isEmpty(value)) {
      validState[name].status = validator.isEmpty(value);
      validState[name].message = `${name} is empty.`;
    } else {
      if (name === 'email' && !validator.isEmail(value)) {
        validState.email.status = true;
        validState.email.message = 'Email address is not valid.';
        error = true;
      }

      if (
        name === 'message' &&
        !validator.isLength(value, { min: 20, max: undefined })
      ) {
        validState.message.status = true;
        validState.message.message = 'Minimum 20 character require in message.';
        error = true;
      }

      if (!error) {
        validState[name].status = validator.isEmpty(value);
        validState[name].message = '';
      }
    }

    this.setState({
      enquiriesForm: tempFormState,
      valid: validState
    });
  };

  render() {
    const { enquiriesForm, valid, formLoader, pageLoader, result } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.layout_narrow}>
          {pageLoader ? (
            <CircularProgress className="h-4 w-4" />
          ) : (
            <div className="container it-facts-figures">
              <AddMetaDescription>
                <title>Media Enquiries | Insight Timer</title>
                <meta
                  name="description"
                  content="# 1 free app for meditation & sleep"
                />
                <meta name="author" content="Insight Network, Inc." />
                <meta
                  name="copyright"
                  content="Insight Network, Inc. Copyright (c) 2019"
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
                  content="https://insighttimer.com/media-enquiries"
                />
                <meta
                  property="og:title"
                  content="Media Enquiries | Insight Timer"
                />
                <meta
                  property="og:description"
                  content="# 1 free app for meditation & sleep"
                />

                <link
                  rel="canonical"
                  href="https://insighttimer.com/media-enquiries"
                />
              </AddMetaDescription>
              <div className="row mb-3 pt-16">
                <div className="col-sm-12 col-md-6 offset-md-3 text-center">
                  <h1 className="mt-2 mb-6 text-4xl font-ProxiBold ">
                    Hi-res images
                  </h1>
                </div>
              </div>
              <div className="row mb-3 pt-16">
                <div className="col-sm text-center">
                  <div className="it-grid-figure-block">
                    <div className={classes.itGridImageContainer_block}>
                      <img
                        className={classes.itGridImg_block}
                        src={LogoBowl}
                        alt=""
                      />
                    </div>
                    <div
                      className={`${classes.itTitle_block} text-base font-ProxiSemibold mb-8`}
                    >
                      Insight logo
                    </div>
                    <Button
                      href={LogoZip}
                      color="primary"
                      variant="contained"
                      component="a"
                      className="font-ProxiRegular mt-6 ml-2 inline-block normal-case text-white bg-xdark_ hover:text-white hover:opacity-75 font-ProxiSemibold text-base lg:text-xl shadow-none cursor-pointer px-16 py-3"
                    >
                      Download ZIP
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row it-mt-60 mb-3 pt-16">
                <div className="col-sm-12 col-md-6 offset-md-3 text-center">
                  <h2 className="text-2xl bold font-ProxiBold">
                    Media enquiries
                  </h2>
                </div>
              </div>

              <div className="row">
                <div className="col-sm container">
                  {formLoader ? (
                    <CircularProgress className="h-4 w-4" />
                  ) : (
                    <form onSubmit={this.submitForm} autoComplete="off">
                      <FormControl fullWidth error={valid.name.status}>
                        <TextField
                          id="it-name"
                          className="font-ProxiRegular"
                          label="Name"
                          variant="outlined"
                          fullWidth
                          value={enquiriesForm.name}
                          onChange={this.handleFormChange('name')}
                          margin="normal"
                          error={valid.name.status}
                        />
                        {valid.name.status && (
                          <FormHelperText>{valid.name.message}</FormHelperText>
                        )}
                      </FormControl>

                      <FormControl fullWidth error={valid.email.status}>
                        <TextField
                          id="it-email"
                          className="font-ProxiRegular"
                          label="Email"
                          variant="outlined"
                          type="email"
                          fullWidth
                          value={enquiriesForm.email}
                          onChange={this.handleFormChange('email')}
                          margin="normal"
                          error={valid.email.status}
                        />
                        {valid.email.status && (
                          <FormHelperText>{valid.email.message}</FormHelperText>
                        )}
                      </FormControl>

                      <FormControl fullWidth error={valid.subject.status}>
                        <TextField
                          id="it-subject"
                          className="font-ProxiRegular"
                          label="Subject"
                          variant="outlined"
                          fullWidth
                          value={enquiriesForm.subject}
                          onChange={this.handleFormChange('subject')}
                          margin="normal"
                          error={valid.subject.status}
                        />
                        {valid.subject.status && (
                          <FormHelperText>
                            {valid.subject.message}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <FormControl fullWidth error={valid.message.status}>
                        <TextField
                          id="it-message"
                          className="font-ProxiRegular"
                          label="Message"
                          variant="outlined"
                          fullWidth
                          value={enquiriesForm.message}
                          onChange={this.handleFormChange('message')}
                          multiline
                          rows={4}
                          margin="normal"
                          error={valid.message.status}
                        />
                        {valid.message.status && (
                          <FormHelperText>
                            {valid.message.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <div className="it-submit-btn-top-margin">
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          className=" capitalize font-ProxiRegular mt-10 ml-2 inline-block normal-case text-white bg-xdark_ hover:text-white hover:opacity-75 font-ProxiSemibold text-base lg:text-xl shadow-none cursor-pointer px-16 py-3"
                        >
                          Submit
                        </Button>
                        {result && (
                          <p className="font-ProxiRegular text-sm m-2">
                            {result}
                          </p>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.setState({
      pageLoader: true
    });
    api
      .getGlobalStats()
      .then(data => {
        this.setState({
          pageLoader: false,
          teachers_number: data.teachers,
          meditators_number: data.meditators
        });
      })
      .catch(err => {
        console.warn(err);
        this.setState({
          pageLoader: false,
          teachers_number: 0,
          meditators_number: 0
        });
      });
  }

  componentDidMount() {
    mparticle.logPageViewed(this.props.location, PageTypes.MediaEnquiries);
    gtm.pushDataLayer({
      event: 'virtual_page_view',
      pageTitle: `Media Enquiries | Insight Timer`,
      pageUrl: this.props.location.pathname,
      pageQuery: this.props.location.search
    });
  }
}

export default withStyles(styles)(MediaEnquiries);
