import { Trans } from '@lingui/macro';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import {
  MobileButton,
  SignUpButton,
  StyledDrawer
} from 'components/Header/MobileNav/styled';
import UserProfile from 'components/Header/UserProfile';
import SearchBar from 'components/SearchBar';
import VerticalSpacing from 'components/VerticalSpacing';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useAuthPopup } from 'hooks/useAuthPopup';
import { AuthState, useFirebaseAuth } from 'hooks/useFirebaseAuth';
import { useHeader } from 'hooks/useHeader';
import { trackEvent } from 'lib/mparticle/trackEvents';
import { MParticleEventType } from 'lib/mparticle/types';
import React, { useState } from 'react';

const MobileNav: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { showSignupPopup } = useAuthPopup();
  const { authState } = useFirebaseAuth();
  const { pageType } = usePageViewTracker();
  const { initialHeight } = useHeader();

  const handleClickSignUpButton = () => {
    trackEvent({
      event_name: 'registration_popup_triggered',
      event_type: MParticleEventType.Navigation,
      page_type: pageType,
      interaction_location: 'menu_web'
    });
    showSignupPopup();
  };

  return (
    <>
      <MobileButton onClick={() => setShowDrawer(!showDrawer)}>
        {showDrawer ? <CloseIcon /> : <MenuIcon />}
      </MobileButton>

      <StyledDrawer
        keepMounted
        transitionDuration={1}
        anchor="top"
        open={showDrawer}
      >
        <VerticalSpacing height={initialHeight + 30} />

        <SearchBar
          pageType={pageType}
          onSearchClick={() => setShowDrawer(false)}
        />

        {authState !== AuthState.AUTHORIZED && (
          <>
            <VerticalSpacing height={25} />
            <SignUpButton onClick={handleClickSignUpButton}>
              <Trans>Sign up free</Trans>
            </SignUpButton>
          </>
        )}

        {authState === AuthState.AUTHORIZED && (
          <>
            <VerticalSpacing height={20} />
            <UserProfile />
          </>
        )}

        <VerticalSpacing height={130} />
      </StyledDrawer>
    </>
  );
};

export default MobileNav;
