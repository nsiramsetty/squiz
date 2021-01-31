import { Trans } from '@lingui/macro';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as MembersPlusFlagWhite } from 'assets_2/images/freetrial/membersPlus.svg';
import VerticalSpacing from 'components/VerticalSpacing';
import { useAuthPopup } from 'hooks/useAuthPopup';
import { AuthState, useFirebaseAuth } from 'hooks/useFirebaseAuth';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import usePrevious from 'hooks/usePrevious';
import { PageTypes } from 'lib/mparticle/enums';
import { trackEvent } from 'lib/mparticle/trackEvents';
import { MParticleEventType } from 'lib/mparticle/types';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import Select from 'react-select';
import { injectStripe } from 'react-stripe-elements';
import { LooseObject } from 'services/interface';
import Stripe from 'stripe';
import { Country } from 'views_2/Player/assets/data/country';
import PoweredStripe from 'views_2/Player/assets/images/logo/powered-stripe.png';
import { withSubmitHandler } from 'views_2/Player/components/Purchase/form/SubmitHandler';
import {
  baseStripe,
  baseStripeRight,
  selectStyles,
  StripeCardCVC,
  StripeCardExpiry,
  StripeCardNumber,
  StyledButton,
  TextInput
} from 'views_2/Player/components/Purchase/form/v2/inputs';
import Snackbar from 'views_2/Player/components/Snackbar';
import { TRIAL_CODE_30 } from 'views_2/Player/config';
import {
  FormTitle,
  FormWrapper,
  MessageContainerDiv,
  TermsContainer
} from './styled';

interface TError {
  message: string;
  type?: string;
  response?: {
    data?: {
      insight_error_code?: string;
      message: string;
    };
  };
}

interface TProps {
  stripe: Stripe;
  submit: (
    purchaseType: string,
    stripe: Stripe,
    userdata: LooseObject,
    metadata: LooseObject,
    trialCode?: string
  ) => Promise<void>;
}

const SubscriptionForm: React.FC<TProps> = ({ stripe, submit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [cardStates, setCardStates] = useState<LooseObject>({});
  const [fields, setFields] = useState({ name: '', zipCode: '', country: '' });
  const i18n = useLinguiI18n();
  const { name, zipCode, country } = fields;

  const { authState, user } = useFirebaseAuth();
  const prevAuthState = usePrevious<AuthState>(authState);
  const { showLoginPopup } = useAuthPopup();
  const [processOnAuth, setProcessOnAuth] = useState(false);

  const handleCardStateChange = (cardState: LooseObject) => {
    const currentState = cardStates;
    currentState[cardState.elementType] = cardState;
    setCardStates(currentState);
  };

  const handleChangeInput = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: string,
    maxLength?: number
  ) => {
    const { value } = e.target as HTMLInputElement;
    if (maxLength && value.length > maxLength) return;
    setFields({ ...fields, [fieldName]: value });
  };

  const validateForm = () => {
    if (!name || name.trim().length === 0) {
      throw new Error(i18n._('Name is required.'));
    }
    if (!zipCode || zipCode.trim().length === 0) {
      throw new Error(i18n._('Zip code is required.'));
    }
    if (!country || country.trim().length === 0) {
      throw new Error(i18n._('Country is required.'));
    }

    if (!cardStates.cardNumber || cardStates.cardNumber.empty) {
      throw new Error(i18n._('Card Number is required.'));
    } else if (cardStates.cardNumber.error) {
      throw new Error(cardStates.cardNumber.error.message);
    }
    if (!cardStates.cardExpiry || cardStates.cardExpiry.empty) {
      throw new Error(i18n._('Card Expiry is required.'));
    } else if (cardStates.cardExpiry.error) {
      throw new Error(cardStates.cardExpiry.error.message);
    }
    if (!cardStates.cardCvc || cardStates.cardCvc.empty) {
      throw new Error(i18n._('Card CVC is required.'));
    } else if (cardStates.cardCvc.error) {
      throw new Error(cardStates.cardCvc.error.message);
    }
  };

  const handleSubscription = useCallback(async () => {
    setLoading(true);
    const userdata = {
      name,
      email: user?.email,
      address: { country, postal_code: zipCode }
    };

    const metadata = {};

    setError(undefined);
    submit('SUBSCRIPTION', stripe, userdata, metadata, TRIAL_CODE_30)
      .then(() => {
        setLoading(false);
        setError(undefined);
        setSuccess(i18n._('Free Trial Successfully completed.'));
      })
      .catch((err: TError) => {
        setSuccess(undefined);
        let errors = i18n._(
          'Sorry for the inconvenience, but the system is currently unavailable. Please try again later.'
        );
        if (
          err.type &&
          (err.type === 'card_error' || err.type === 'validation_error')
        ) {
          // Stripe error
          errors = err.message;
        } else if (
          err.response &&
          err.response.data &&
          err.response.data.insight_error_code &&
          err.response.data.insight_error_code === 'CLIENT_ERROR'
        ) {
          // Stripe error from API
          errors = err.response.data.message;
        }
        setError(errors);
        setLoading(false);
      });
  }, [
    setError,
    setSuccess,
    setLoading,
    user,
    name,
    zipCode,
    country,
    stripe,
    submit,
    i18n
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      validateForm();
    } catch (err) {
      setError(err.message);
      return;
    }

    if (user && user.uid) {
      handleSubscription();
    } else {
      trackEvent({
        event_name: 'registration_popup_triggered',
        event_type: MParticleEventType.Navigation,
        page_type: PageTypes.FreeTrialPage,
        interaction_location: 'subscribe_free_trial_web'
      });
      showLoginPopup();
      setProcessOnAuth(true);
    }
  };

  useEffect(() => {
    if (
      authState === AuthState.AUTHORIZED &&
      prevAuthState !== AuthState.AUTHORIZED
    ) {
      if (processOnAuth) {
        handleSubscription();
        setProcessOnAuth(false);
      }
    }
  }, [
    prevAuthState,
    authState,
    processOnAuth,
    setProcessOnAuth,
    handleSubscription
  ]);

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit}>
        <FormWrapper>
          <MembersPlusFlagWhite />
          <FormTitle>
            <Trans>No Commitment, Cancel Anytime</Trans>
          </FormTitle>

          <Grid item>
            {success && (
              <Snackbar
                variant="success"
                message={success}
                onClose={() => setSuccess(undefined)}
              />
            )}
            {error && (
              <Snackbar
                variant="error"
                message={error}
                onClose={() => setError(undefined)}
              />
            )}
          </Grid>

          <Grid item className="mb-4">
            <TextInput
              id="name"
              value={name}
              placeholder={i18n._('Name on card')}
              disabled={false}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleChangeInput(e, 'name');
              }}
            />
          </Grid>

          <Grid item className="mb-4">
            <StripeCardNumber
              placeholder={i18n._('Card number')}
              style={baseStripe}
              disabled={loading}
              onChange={handleCardStateChange}
            />
          </Grid>

          <Grid item className="mb-4">
            <Grid container spacing={2} className="my-0">
              <Grid item xs={7} className="py-0 relative">
                <StripeCardExpiry
                  id="card_expiry"
                  style={baseStripeRight}
                  disabled={loading}
                  onChange={handleCardStateChange}
                />
                <div className="font-ProxiSemibold text-base absolute left-0 top-0 h-full flex items-center">
                  <div className="ml-6 text-xdark">
                    <Trans>Expiry</Trans>
                  </div>
                </div>
              </Grid>

              <Grid item xs={5} className="py-0">
                <StripeCardCVC
                  id="card_cvc"
                  placeholder={i18n._('CVC')}
                  style={baseStripe}
                  disabled={loading}
                  onChange={handleCardStateChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item className="mb-8">
            <Grid container spacing={2} className="my-0">
              <Grid item xs={7} className="py-0">
                <Select
                  id="country"
                  components={{ IndicatorSeparator: null }}
                  placeholder={i18n._('Country')}
                  options={Country}
                  styles={selectStyles}
                  isDisabled={loading}
                  onChange={value => {
                    if (value && 'code' in value)
                      setFields({ ...fields, country: value.code });
                  }}
                />
              </Grid>

              <Grid item xs={5} className="py-0">
                <TextInput
                  value={zipCode}
                  id="zipCode"
                  placeholder={i18n._('Zip code')}
                  disabled={loading}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleChangeInput(e, 'zipCode', 10);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <MessageContainerDiv>
            <Trans>US$59.99 billed annually after free trial.</Trans>
          </MessageContainerDiv>

          <Grid item className="mb-6">
            <StyledButton
              disabled={loading}
              className="shadow-none outline-none "
              variant="contained"
              type="submit"
            >
              {loading ? (
                <CircularProgress className="w-6 h-6 text-black" />
              ) : (
                'Start free trial'
              )}
            </StyledButton>
          </Grid>

          <MessageContainerDiv>
            <Trans>
              {`You won't be charged until after your 30‑day free trial. We'll
              remind you three days before your trial ends.`}
            </Trans>
          </MessageContainerDiv>

          <Grid item>
            <img
              src={PoweredStripe}
              alt=""
              style={{ maxWidth: '220px' }}
              className="mx-auto"
            />
          </Grid>
        </FormWrapper>
      </form>
      <VerticalSpacing height={20} />
      <TermsContainer>
        <Trans>
          {`Subscribe to MemberPlus on 30 Day Free Trial. Your annual subscription
          will automatically begin after 30 days at US $59.99 if you don't
          cancel before hand.`}
        </Trans>
      </TermsContainer>
      <VerticalSpacing height={15} />
      <TermsContainer>
        <Trans>
          By continuing with purchase you agree to our{' '}
          <a
            href="https://insighttimer.com/terms-and-privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </Trans>
      </TermsContainer>
      <VerticalSpacing height={20} />
    </>
  );
};

export default injectStripe(withSubmitHandler(SubscriptionForm));
