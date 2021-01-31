import { Trans } from '@lingui/macro';
import { StyledTextButton, SwitchAuth } from 'components/SwitchAuth';
import VerticalSpacing from 'components/VerticalSpacing';
import { useAuthPopup } from 'hooks/useAuthPopup';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmailSignUpPage from './EmailSignUpPage';
import SelectPage from './SelectPage';
import { MainTitle } from './styles';

const Signup: React.FC<{
  showTitle?: boolean;
  onSwitchSignIn?: () => void;
  onHideHeading?: (v: boolean) => void;
  showBackIcon?: boolean;
}> = ({ showTitle = true, onSwitchSignIn, onHideHeading, showBackIcon }) => {
  const { prefillEmail } = useAuthPopup();

  const [currentPage, setCurrentPage] = useState<'SELECT' | 'SIGNUP_EMAIL'>(
    prefillEmail ? 'SIGNUP_EMAIL' : 'SELECT'
  );

  useEffect(() => {
    if (onHideHeading) {
      if (currentPage === 'SIGNUP_EMAIL') {
        onHideHeading(true);
      } else {
        onHideHeading(false);
      }
    }
  }, [currentPage, onHideHeading]);

  return (
    <>
      {currentPage === 'SELECT' ? (
        <>
          {showTitle && (
            <MainTitle>
              <Trans>#1 free app for sleep, anxiety and stress.</Trans>
            </MainTitle>
          )}
          <VerticalSpacing height={13} />
          <SelectPage onChangePage={setCurrentPage} />
        </>
      ) : (
        <EmailSignUpPage
          onChangePage={setCurrentPage}
          showBackIcon={showBackIcon}
        />
      )}

      <VerticalSpacing height={15} />

      <SwitchAuth>
        <Trans>Already signed up?</Trans>
        {onSwitchSignIn ? (
          <StyledTextButton onClick={() => onSwitchSignIn()}>
            <Trans>Log in</Trans>
          </StyledTextButton>
        ) : (
          <StyledTextButton
            component={Link}
            rel="nofollow"
            to={`/login${window.location.search || ''}`}
          >
            <Trans>Log in</Trans>
          </StyledTextButton>
        )}
      </SwitchAuth>
    </>
  );
};

export default Signup;
