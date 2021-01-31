import HeaderSpacing from 'components/HeaderSpacing';
import InputText from 'components/InputText';
import {
  EmailAddressDiv,
  ErrorMessageDiv,
  FormContainer,
  MessageContainerDiv,
  PasswordHeadingDiv,
  PasswordHintDiv,
  ResetPasswordDiv,
  SuccessMessageDiv
} from 'components/PasswordReset/styled';
import SectionContainer from 'components/SectionContainer';
import SubmitButton from 'components/SubmitButton';
import VerticalSpacing from 'components/VerticalSpacing';
import Footer from 'components_2/footer';
import { usePasswordReset } from 'hooks/usePasswordReset';
import queryString from 'query-string';
import React, { useState } from 'react';

const PasswordReset: React.FC = () => {
  const [passwordValue, setPasswordValue] = useState<string>('');
  const queryObject = queryString.parse(window.location.search);
  const {
    email,
    errorMessage,
    success,
    passwordSuccess,
    passwordMessage,
    changePassword
  } = usePasswordReset(queryObject.mode, queryObject.oobCode);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    changePassword(passwordValue);
  };

  return (
    <>
      <HeaderSpacing />
      <SectionContainer>
        <ResetPasswordDiv>
          <FormContainer>
            {success ? (
              <>
                <PasswordHeadingDiv>Reset your password</PasswordHeadingDiv>
                <EmailAddressDiv>{email}</EmailAddressDiv>
                <VerticalSpacing height={40} />
                <form onSubmit={handleSubmit} autoComplete="off">
                  <InputText
                    name="password"
                    type="password"
                    disabled={false}
                    placeholder="New Password"
                    onChange={e => setPasswordValue(e.target.value)}
                    value={passwordValue}
                  />

                  <MessageContainerDiv>
                    <PasswordHintDiv>Minimum 6 characters</PasswordHintDiv>
                  </MessageContainerDiv>

                  <VerticalSpacing height={20} />

                  <SubmitButton isSubmitting={false}>Save</SubmitButton>

                  <VerticalSpacing height={20} />

                  {passwordMessage && (
                    <MessageContainerDiv>
                      {passwordSuccess ? (
                        <SuccessMessageDiv>{passwordMessage}</SuccessMessageDiv>
                      ) : (
                        <ErrorMessageDiv>{passwordMessage}</ErrorMessageDiv>
                      )}
                    </MessageContainerDiv>
                  )}
                </form>
              </>
            ) : (
              <>
                <PasswordHeadingDiv>{errorMessage}</PasswordHeadingDiv>
              </>
            )}
            <VerticalSpacing height={60} />
          </FormContainer>
        </ResetPasswordDiv>
      </SectionContainer>
      <Footer />
    </>
  );
};

export default PasswordReset;
