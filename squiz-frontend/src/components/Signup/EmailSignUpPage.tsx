import { Trans } from '@lingui/macro';
import BackIconButton from 'components/BackIconButton';
import FormTitle from 'components/FormTitle';
import SignUpEmailForm from 'components/SignUpEmailForm';
import VerticalSpacing from 'components/VerticalSpacing';
import React from 'react';

type TProps = {
  onChangePage: (page: 'SELECT' | 'SIGNUP_EMAIL') => void;
  showBackIcon?: boolean;
};

const EmailSignUpPage: React.FC<TProps> = ({ onChangePage, showBackIcon }) => {
  return (
    <>
      {showBackIcon && (
        <BackIconButton
          onClick={() => {
            onChangePage('SELECT');
          }}
        />
      )}
      <VerticalSpacing height={20} />

      <FormTitle>
        <Trans>Create your free account</Trans>
      </FormTitle>

      <VerticalSpacing height={24} />

      <SignUpEmailForm />
    </>
  );
};

export default EmailSignUpPage;
