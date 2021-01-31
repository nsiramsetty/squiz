import { Trans } from '@lingui/macro';
import InputAdornment from '@material-ui/core/InputAdornment';
import ErrorMessage from 'components/ErrorMessage';
import InputText from 'components/InputText';
import StyledForgotLink from 'components/SignInEmailForm/StyledForgotLink';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useForm } from 'hooks/useForm';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { useTaxonomy } from 'hooks/useTaxonomy';
import { loginWithEmailAndPassword } from 'lib/firebase/auth';
import { EventNames } from 'lib/mparticle/enums';
import { loginMParticle } from 'lib/mparticle/loggers';
import { trackEvent } from 'lib/mparticle/trackEvents';
import { MParticleEventType } from 'lib/mparticle/types';
import React, { useState } from 'react';
import SubmitButton from '../SubmitButton';

type TProps = {
  onSubmitCleanErrorsOutsideForm?: (e?: string) => void;
  cleanErrorInsideForm?: boolean;
  onSubmitTurnOffCleanErrorInsideForm?: (e?: boolean) => void;
};

const LoginForm: React.FC<TProps> = ({
  onSubmitCleanErrorsOutsideForm,
  cleanErrorInsideForm,
  onSubmitTurnOffCleanErrorInsideForm
}) => {
  const { currentInputs, handleInputChanges } = useForm({
    email: '',
    password: ''
  });
  const { email, password } = currentInputs;
  const [error, setError] = useState(undefined);
  const [submitting, setSubmitting] = useState(false);
  const { pageType } = usePageViewTracker();
  const i18n = useLinguiI18n();
  const taxonony = useTaxonomy();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    trackEvent({
      event_name: 'registration_popup_signin_interacted',
      event_type: MParticleEventType.Navigation,
      page_type: pageType,
      type: 'email'
    });
    if (onSubmitTurnOffCleanErrorInsideForm) {
      onSubmitTurnOffCleanErrorInsideForm(false);
    }
    if (onSubmitCleanErrorsOutsideForm) {
      onSubmitCleanErrorsOutsideForm();
    }
    setError(undefined);
    setSubmitting(true);
    try {
      const { user } = await loginWithEmailAndPassword(email, password);
      if (user) {
        loginMParticle(EventNames.SignIn, user.email, user.uid);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
      <InputText
        name="email"
        disabled={submitting}
        placeholder={i18n._('Email')}
        onChange={handleInputChanges}
        value={email}
        autoFocus
      />

      <div className="spacing" style={{ height: '18px' }} />

      <InputText
        name="password"
        type="password"
        disabled={submitting}
        placeholder={i18n._('Your password')}
        paddingRight={72}
        endAdornment={
          <InputAdornment position="end">
            <StyledForgotLink
              disabled={submitting}
              href={taxonony.getResetPasswordUrl()}
            >
              <Trans>Forgot</Trans>
            </StyledForgotLink>
          </InputAdornment>
        }
        onChange={handleInputChanges}
        value={password}
      />
      <ErrorMessage>{!cleanErrorInsideForm && error}</ErrorMessage>
      <SubmitButton isSubmitting={submitting}>
        <Trans>Log in</Trans>
      </SubmitButton>
    </form>
  );
};

export default LoginForm;
