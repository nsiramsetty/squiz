import React from 'react';
import MobileNav from './MobileNav';
import { HeaderBlock, MobileContainer } from './styled';

const Mobile: React.FC = () => {
  return (
    <MobileContainer>
      <HeaderBlock>
        <MobileNav />
      </HeaderBlock>
    </MobileContainer>
  );
};

export default Mobile;
