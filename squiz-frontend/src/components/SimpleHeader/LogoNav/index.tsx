import TextLogo from 'assets_2/images/logo/insighttimer.svg';
import React from 'react';
import { StyledLogoNav, StyledTextLogo } from './styled';

const LogoNav: React.FC = () => {
  return (
    <StyledLogoNav to="/">
      <StyledTextLogo src={TextLogo} alt="Insight Timer logo" />
    </StyledLogoNav>
  );
};

export default LogoNav;
