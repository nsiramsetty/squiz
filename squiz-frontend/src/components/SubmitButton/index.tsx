import styled from '@emotion/styled';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StylesProvider } from '@material-ui/core/styles';
import React from 'react';

const SubmitButtonStyled = styled(Button)<ButtonProps>`
  outline: 0;
  font-family: ProximaNova;
  font-weight: 600;
  background-color: rgba(26, 26, 26, 1);
  color: white !important;
  text-transform: none;
  width: 100%;
  text-transform: normal-case;
  height: 44px;
  :hover {
    background-color: rgba(26, 26, 26, 0.75);
  }
  :disabled {
    background-color: rgba(26, 26, 26, 0.6);
  }
`;

type TProps = {
  isSubmitting?: boolean;
  disabled?: boolean;
};

const SubmitButton: React.FC<TProps> = ({
  children,
  isSubmitting,
  disabled
}) => {
  return (
    <StylesProvider injectFirst>
      <SubmitButtonStyled type="submit" disabled={isSubmitting || disabled}>
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <span> {children}</span>
        )}
      </SubmitButtonStyled>
    </StylesProvider>
  );
};

export default SubmitButton;
