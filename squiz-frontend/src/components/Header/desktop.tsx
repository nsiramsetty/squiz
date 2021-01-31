import { Trans } from '@lingui/macro';
import { Box } from '@material-ui/core';
import { InteractionLocations } from 'lib/mparticle/enums';
import React from 'react';
import AuthNav from './AuthNav';
import LibraryNav from './LibraryNav';
import LogoNav from './LogoNav';
import SearchNav from './SearchNav';
import StandardNav from './StandardNav';
import {
  DesktopContainer,
  DesktopNavs,
  HeaderBlock,
  RightNavs,
  Text
} from './styled';

const Desktop: React.FC = () => {
  return (
    <DesktopContainer>
      <HeaderBlock>
        <LogoNav />

        <DesktopNavs>
          <LibraryNav />

          <StandardNav
            to="/yoga"
            interactionLocation={InteractionLocations.Header}
          >
            <Trans>Yoga</Trans>
          </StandardNav>

          <StandardNav
            to="/meditation-topics/sleep"
            interactionLocation={InteractionLocations.Header}
          >
            <Trans>Sleep</Trans>
          </StandardNav>

          <StandardNav
            to="/live"
            interactionLocation={InteractionLocations.Header}
          >
            <Trans>Live</Trans>
          </StandardNav>

          <StandardNav
            to="/teams"
            interactionLocation={InteractionLocations.Header}
          >
            <Trans>Circles for Teams</Trans>
            <Box width="6px" />
            <Box
              padding="5px"
              bgcolor="#06868a"
              width="36px"
              height="18px"
              borderRadius="5px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text>NEW</Text>
            </Box>
          </StandardNav>
        </DesktopNavs>

        <RightNavs>
          <SearchNav />

          <AuthNav />
        </RightNavs>
      </HeaderBlock>
    </DesktopContainer>
  );
};

export default Desktop;
