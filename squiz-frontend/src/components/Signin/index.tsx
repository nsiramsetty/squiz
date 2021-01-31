import { Trans } from '@lingui/macro';
import ErrorMessage from 'components/ErrorMessage';
import FormTitle from 'components/FormTitle';
import SignInEmailForm from 'components/SignInEmailForm';
import SignInWithApple from 'components/SignInWithApple';
import SignInWithFacebook from 'components/SignInWithFacebook';
import { StyledTextButton, SwitchAuth } from 'components/SwitchAuth';
import VerticalSpacing from 'components/VerticalSpacing';
import { usePageViewTracker } from 'context/PageViewTracker';
import { trackEvent } from 'lib/mparticle/trackEvents';
import { MParticleEventType } from 'lib/mparticle/types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Separator from '../Separator';

type TProps = {
  showTitle?: boolean;
  onSwitchSignUp?: () => void;
};
const Signin: React.FC<TProps> = ({ showTitle = true, onSwitchSignUp }) => {
  const [loading, setLoading] = useState(false);
  const [facebookError, setFacebookError] = useState<string>();
  const [appleError, setAppleError] = useState<string>();
  const [cleanErrorInsideForm, setCleanErrorInsideForm] = useState<boolean>();
  const { pageType } = usePageViewTracker();

  return (
    <>
      {showTitle && (
        <FormTitle>
          <Trans>Log in to your account</Trans>
        </FormTitle>
      )}

      <div className="spacing" style={{ height: '24px' }} />

      <SignInWithFacebook
        disabled={loading}
        onSubmit={() => {
          trackEvent({
            event_name: 'registration_popup_signin_interacted',
            event_type: MParticleEventType.Navigation,
            page_type: pageType,
            type: 'facebook'
          });
          setCleanErrorInsideForm(true);
          setAppleError(undefined);
          setLoading(true);
        }}
        onComplete={(e?: string) => {
          setLoading(false);
          setFacebookError(e);
        }}
      />

      {facebookError && <ErrorMessage>{facebookError}</ErrorMessage>}
      {!facebookError && <div className="spacing" style={{ height: '14px' }} />}

      <SignInWithApple
        disabled={loading}
        onSubmit={() => {
          trackEvent({
            event_name: 'registration_popup_signin_interacted',
            event_type: MParticleEventType.Navigation,
            page_type: pageType,
            type: 'apple'
          });
          setCleanErrorInsideForm(true);
          setFacebookError(undefined);
          setLoading(true);
        }}
        onComplete={(e?: string) => {
          setLoading(false);
          setAppleError(e);
        }}
      />

      {appleError && <ErrorMessage>{appleError}</ErrorMessage>}
      {!appleError && <div className="spacing" style={{ height: '16px' }} />}

      <Separator>
        <Trans>or</Trans>
      </Separator>

      <VerticalSpacing height={16} />

      <SignInEmailForm
        onSubmitCleanErrorsOutsideForm={() => {
          setAppleError(undefined);
          setFacebookError(undefined);
        }}
        cleanErrorInsideForm={cleanErrorInsideForm}
        onSubmitTurnOffCleanErrorInsideForm={setCleanErrorInsideForm}
      />

      <VerticalSpacing height={16} />

      <SwitchAuth>
        <Trans>Don’t have an account?</Trans>
        {onSwitchSignUp ? (
          <StyledTextButton onClick={() => onSwitchSignUp()}>
            <Trans>Sign up</Trans>
          </StyledTextButton>
        ) : (
          <StyledTextButton
            component={Link}
            rel="nofollow"
            to={`/signup${window.location.search || ''}`}
          >
            <Trans>Sign up</Trans>
          </StyledTextButton>
        )}
      </SwitchAuth>
    </>
  );
};

export default Signin;
