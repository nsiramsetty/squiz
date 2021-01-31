import styled from '@emotion/styled';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StylesProvider } from '@material-ui/core/styles';
import React from 'react';

const SubmitButtonStyled = styled(Button)<ButtonProps>`
  outline: 0;
  font-family: ProximaNova;
  font-size: 18px;
  font-weight: 600;
  line-height: 25px;
  letter-spacing: 0.5px;
  color: #ffffff !important;
  border-radius: 10px;
  background-color: #222222;
  text-transform: none;
  width: 100%;
  text-transform: normal-case;
  height: 50px;
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
          <span>{children}</span>
        )}
      </SubmitButtonStyled>
    </StylesProvider>
  );
};

export default SubmitButton;
