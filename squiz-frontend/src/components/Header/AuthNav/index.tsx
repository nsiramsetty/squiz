import { Trans } from '@lingui/macro';
import { ReactComponent as DownIcon } from 'assets_2/icons/down.svg';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useAuthPopup } from 'hooks/useAuthPopup';
import { AuthState, useFirebaseAuth } from 'hooks/useFirebaseAuth';
import {
  ClickedEventNames,
  InteractionLocations,
  PageTypes
} from 'lib/mparticle/enums';
import { logClicked } from 'lib/mparticle/loggers';
import { trackEvent } from 'lib/mparticle/trackEvents';
import { MParticleEventType } from 'lib/mparticle/types';
import React, { useRef, useState } from 'react';
import UserProfile from '../UserProfile';
import {
  AuthAvatar,
  AuthAvatarButton,
  AuthButton,
  AuthPopover,
  AuthUsername
} from './styled';

const AuthNav: React.FC = () => {
  const UserRef = useRef<HTMLButtonElement>(null);

  const { user, authState, userName } = useFirebaseAuth();
  const [showProfile, setShowProfile] = useState(false);

  const { showLoginPopup } = useAuthPopup();
  const { pageType } = usePageViewTracker();

  const handleClickLoginButton = () => {
    trackEvent({
      event_name: 'registration_popup_triggered',
      event_type: MParticleEventType.Navigation,
      page_type: pageType,
      interaction_location: 'header_web'
    });
    showLoginPopup();
  };

  const handleClickProfile = () => {
    setShowProfile(!showProfile);
    logClicked(
      ClickedEventNames.CTA_ProfileOpened,
      pageType || PageTypes.Unknown,
      'Profile',
      InteractionLocations.Header
    );
  };

  return (
    <div>
      {authState === AuthState.AUTHORIZED && user && (
        <AuthAvatarButton
          ref={UserRef}
          disableRipple
          onClick={handleClickProfile}
        >
          <AuthAvatar
            src={`${process.env.REACT_APP_PUBLISHER_IMAGE}/${user.uid}%2Fpictures%2Fsquare_medium.jpeg?alt=media"`}
          />

          <AuthUsername>{userName || ''}</AuthUsername>

          <DownIcon />
        </AuthAvatarButton>
      )}

      {authState !== AuthState.AUTHORIZED && (
        <AuthButton
          onClick={handleClickLoginButton}
          disabled={authState === AuthState.PENDING}
        >
          <Trans>Sign In</Trans>
        </AuthButton>
      )}

      <AuthPopover
        id="profile"
        open={showProfile}
        anchorEl={(showProfile && UserRef.current) || undefined}
        onClose={() => {
          setShowProfile(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <UserProfile onLogout={() => setShowProfile(false)} />
      </AuthPopover>
    </div>
  );
};

export default AuthNav;
