import { Trans } from '@lingui/macro';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StylesProvider } from '@material-ui/core/styles';
import { signInFacebook } from 'lib/firebase/auth';
import { EventNames } from 'lib/mparticle/enums';
import { loginMParticle } from 'lib/mparticle/loggers';
import React, { useState } from 'react';
import { ReactComponent as FacebookIcon } from './facebookIcon.svg';
import { IconDiv, StyledButton, StyledSpan } from './styled';

interface Props {
  signup?: boolean;
  disabled?: boolean;
  onSubmit: () => void;
  onComplete: (err?: string) => void;
}

const SignInWithFacebook: React.FC<Props> = ({
  signup,
  disabled,
  onSubmit,
  onComplete
}) => {
  const [loading, setLoading] = useState(false);

  const handleFacebookSignIn = () => {
    onSubmit();
    setLoading(true);
    signInFacebook()
      .then(({ user }) => {
        if (user)
          loginMParticle(
            EventNames.SignIn,
            user.email,
            user.uid,
            'with_facebook'
          );
        onComplete();
      })
      .catch(error => onComplete(error))
      .finally(() => setLoading(false));
  };

  return (
    <StylesProvider injectFirst>
      <StyledButton
        onClick={handleFacebookSignIn}
        disabled={disabled}
        variant="outlined"
      >
        <StyledSpan>
          <IconDiv>
            {loading ? (
              <CircularProgress size={19} color="inherit" />
            ) : (
              <FacebookIcon fill="#000" alt="facebook_icon" />
            )}
          </IconDiv>
          {signup ? (
            <Trans>Sign up with Facebook</Trans>
          ) : (
            <Trans>Sign in with Facebook</Trans>
          )}
        </StyledSpan>
      </StyledButton>
    </StylesProvider>
  );
};

export default SignInWithFacebook;
