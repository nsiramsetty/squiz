import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import ErrorMessage from 'components/ErrorMessage';
import InputText from 'components/InputText';
import { useAuthPopup } from 'hooks/useAuthPopup';
import { useForm } from 'hooks/useForm';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { signupWithEmailAndPassword } from 'lib/firebase/auth';
import { EventNames } from 'lib/mparticle/enums';
import { loginMParticle } from 'lib/mparticle/loggers';
import React, { useState } from 'react';
import SubmitButton from '../SubmitButton';

const PasswordHint = styled.div`
  color: rgba(24, 24, 24, 0.8);
`;

const StaticForm: React.FC = () => {
  const { prefillEmail } = useAuthPopup();
  const { currentInputs, handleInputChanges } = useForm({
    name: '',
    email: prefillEmail || '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const { name, email, password } = currentInputs;

  const i18n = useLinguiI18n();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    setError(undefined);
    setSubmitting(true);
    try {
      const user = await signupWithEmailAndPassword(email, name, password);
      if (user) {
        loginMParticle(EventNames.SignUpEmail, user.email, user.uid); // mparticle
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

      <div className="spacing" style={{ height: '14px' }} />

      <InputText
        name="name"
        disabled={submitting}
        placeholder={i18n._('Full name')}
        onChange={handleInputChanges}
        value={name}
      />

      <div className="spacing" style={{ height: '14px' }} />

      <InputText
        name="password"
        type="password"
        disabled={submitting}
        placeholder={i18n._('Your password')}
        onChange={handleInputChanges}
        value={password}
      />

      <ErrorMessage>
        {!error ? (
          <PasswordHint>
            <Trans>Minimum 6 characters</Trans>
          </PasswordHint>
        ) : (
          error
        )}
      </ErrorMessage>

      <div className="spacing" style={{ height: '10px' }} />

      <SubmitButton isSubmitting={submitting}>
        <Trans>Create free account</Trans>
      </SubmitButton>
    </form>
  );
};

export default StaticForm;
