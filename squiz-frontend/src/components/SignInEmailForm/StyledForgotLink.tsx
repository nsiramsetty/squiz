import styled from '@emotion/styled';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { StylesProvider } from '@material-ui/core/styles';
import React from 'react';

const ForgotLink = styled(Button)`
  position: absolute !important;
  font-family: ProximaNova;
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
  letter-spacing: 0.17px;
  color: rgba(26, 26, 26, 1);
  line-height: 17px;
  text-align: right;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;

  :hover {
    background: transparent;
  }
` as typeof Button;

const StyledForgotLink: React.FC<ButtonProps> = props => (
  <StylesProvider injectFirst>
    <ForgotLink {...props} />
  </StylesProvider>
);

export default StyledForgotLink;
