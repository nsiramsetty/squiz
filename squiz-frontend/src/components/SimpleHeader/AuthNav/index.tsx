import { ReactComponent as DownIcon } from 'assets_2/icons/down.svg';
import UserProfile from 'components/Header/UserProfile';
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
import {
  AuthAvatar,
  AuthAvatarButton,
  AuthButton,
  AuthPopover,
  QuestionText,
  TextLogIn,
  UserName
} from './styled';

const AuthNav: React.FC = () => {
  const UserRef = useRef<HTMLButtonElement>(null);

  const { user, userName, authState } = useFirebaseAuth();
  const [showProfile, setShowProfile] = useState(false);

  const { showSignupPopup, showLoginPopup } = useAuthPopup();
  const { pageType } = usePageViewTracker();

  const handleClickNotAMemberButton = () => {
    trackEvent({
      event_name: 'registration_popup_triggered',
      event_type: MParticleEventType.Navigation,
      page_type: pageType,
      interaction_location: 'header_web'
    });
    showSignupPopup();
  };

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
    logClicked(
      ClickedEventNames.CTA_ProfileOpened,
      pageType || PageTypes.Unknown,
      'Profile',
      InteractionLocations.Header
    );
    setShowProfile(!showProfile);
  };

  return (
    <div>
      {authState === AuthState.AUTHORIZED && user && (
        <AuthAvatarButton
          ref={UserRef}
          disableRipple
          onClick={handleClickProfile}
        >
          <UserName>{userName}</UserName>
          <AuthAvatar
            src={`${process.env.REACT_APP_PUBLISHER_IMAGE}/${user.uid}%2Fpictures%2Fsquare_medium.jpeg?alt=media`}
          />
          <DownIcon />
        </AuthAvatarButton>
      )}

      {authState !== AuthState.AUTHORIZED && (
        <>
          <QuestionText onClick={handleClickNotAMemberButton}>
            Not a member?
          </QuestionText>
          <AuthButton
            onClick={handleClickLoginButton}
            disabled={authState === AuthState.PENDING}
          >
            <TextLogIn>Log in</TextLogIn>
          </AuthButton>
        </>
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
