import { Trans } from '@lingui/macro';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StylesProvider } from '@material-ui/core/styles';
import { signInApple } from 'lib/firebase/auth';
import { EventNames } from 'lib/mparticle/enums';
import { loginMParticle } from 'lib/mparticle/loggers';
import React, { useState } from 'react';
import { ReactComponent as AppleSvg } from './black_apple_logo.svg';
import {
  IconWrapper,
  ProgressWrapper,
  StyledButton,
  StyledSpan
} from './styled';

interface Props {
  signup?: boolean;
  disabled?: boolean;
  onSubmit: () => void;
  onComplete: (err?: string) => void;
}

const SignInWithApple: React.FC<Props> = ({
  signup,
  disabled,
  onSubmit,
  onComplete
}) => {
  const [loading, setLoading] = useState(false);

  const handleAppleSignIn = () => {
    onSubmit();
    setLoading(true);
    signInApple()
      .then(({ user }) => {
        if (user)
          loginMParticle(EventNames.SignIn, user.email, user.uid, 'with_apple');
        onComplete();
      })
      .catch(error => onComplete(error))
      .finally(() => setLoading(false));
  };

  return (
    <StylesProvider injectFirst>
      <StyledButton
        onClick={handleAppleSignIn}
        disabled={disabled}
        variant="outlined"
      >
        <StyledSpan>
          {loading ? (
            <ProgressWrapper>
              <CircularProgress size={19} color="inherit" />
            </ProgressWrapper>
          ) : (
            <IconWrapper>
              <AppleSvg height="100%" />
            </IconWrapper>
          )}
          {signup ? (
            <Trans>Sign up with Apple</Trans>
          ) : (
            <Trans>Sign in with Apple</Trans>
          )}
        </StyledSpan>
      </StyledButton>
    </StylesProvider>
  );
};

export default SignInWithApple;
