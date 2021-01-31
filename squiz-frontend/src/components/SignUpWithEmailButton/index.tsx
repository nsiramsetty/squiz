import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import Button from '@material-ui/core/Button';
import { StylesProvider } from '@material-ui/core/styles';
import React from 'react';

export const StyledButton = styled(Button)`
  outline: 0;
  height: 44px;
  width: 100%;
  border-radius: 4px;
  background: black;
  color: white;
  :focus {
    outline: 0;
  }
  :hover {
    background: rgba(0, 0, 0, 0.75);
  }
  :disabled {
    background: rgba(0, 0, 0, 0.55);
  }
`;

export const StyledSpan = styled.span`
  font-family: ProximaNova;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0.17px;
  text-align: center;
  color: #ffffff;
  text-transform: none;
`;

type TProps = {
  disabled?: boolean;
  onClick: () => void;
};

const SignUpWithEmailButton: React.FC<TProps> = ({ disabled, onClick }) => {
  return (
    <StylesProvider injectFirst>
      <StyledButton disabled={disabled} onClick={onClick}>
        <StyledSpan>
          <Trans>Sign up with email</Trans>
        </StyledSpan>
      </StyledButton>
    </StylesProvider>
  );
};

export default SignUpWithEmailButton;
