import ErrorMessage from 'components/ErrorMessage';
import FormTitle from 'components/FormTitle';
import InputText from 'components/InputText';
import SubmitButton from 'components/SubmitButton';
import VerticalSpacing from 'components/VerticalSpacing';
import { useForm } from 'hooks/useForm';
import { changePassword } from 'lib/firebase/auth';
import React, { useState } from 'react';

interface TProps {
  title?: string;
  onSuccess?: () => void;
}

const ChangePasswordForm: React.FC<TProps> = ({ title, onSuccess }) => {
  const { currentInputs, handleInputChanges } = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { currentPassword, newPassword, confirmPassword } = currentInputs;
  const [error, setError] = useState(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (submitting) return;

    setError(undefined);
    setSubmitting(true);

    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormTitle>{title || 'Change Password'}</FormTitle>

      <VerticalSpacing height={24} />

      <form onSubmit={handleSubmit} autoComplete="off">
        <InputText
          name="currentPassword"
          type="password"
          disabled={submitting}
          placeholder="Current password"
          onChange={handleInputChanges}
          value={currentPassword}
          autoFocus
        />

        <VerticalSpacing height={18} />

        <InputText
          name="newPassword"
          type="password"
          disabled={submitting}
          placeholder="New password"
          onChange={handleInputChanges}
          value={newPassword}
        />

        <VerticalSpacing height={18} />

        <InputText
          name="confirmPassword"
          type="password"
          disabled={submitting}
          placeholder="Confirm password"
          onChange={handleInputChanges}
          value={confirmPassword}
        />

        <VerticalSpacing height={!submitting && error ? 5 : 0} />

        <ErrorMessage>{!submitting && error}</ErrorMessage>

        <VerticalSpacing height={!submitting && error ? 5 : 0} />

        <SubmitButton isSubmitting={submitting}>Change password</SubmitButton>
      </form>
    </>
  );
};

export default ChangePasswordForm;
