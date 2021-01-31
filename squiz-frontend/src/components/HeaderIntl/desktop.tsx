import AuthNav from 'components/Header/AuthNav';
import LogoNav from 'components/Header/LogoNav';
import SearchNav from 'components/Header/SearchNav';
import {
  DesktopContainer,
  HeaderBlock,
  RightNavs
} from 'components/Header/styled';
import React from 'react';

const Desktop: React.FC = () => {
  return (
    <DesktopContainer>
      <HeaderBlock>
        <LogoNav />

        <RightNavs>
          <SearchNav />
          <AuthNav />
        </RightNavs>
      </HeaderBlock>
    </DesktopContainer>
  );
};

export default Desktop;
