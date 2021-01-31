import LogoNav from 'components/Header/LogoNav';
import { HeaderBlock, MobileContainer } from 'components/Header/styled';
import React from 'react';
import MobileNav from './MobileNav';

const Mobile: React.FC = () => {
  return (
    <MobileContainer>
      <HeaderBlock>
        <LogoNav />
        <MobileNav />
      </HeaderBlock>
    </MobileContainer>
  );
};

export default Mobile;
