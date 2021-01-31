import { Trans } from '@lingui/macro';
import Divider from '@material-ui/core/Divider';
import { WEB_DOMAIN } from 'Config/constants';
import { useFirebaseAuth } from 'hooks/useFirebaseAuth';
import { getIdToken, sessionLogin } from 'lib/firebase/auth';
import React from 'react';
import {
  Container,
  UserAvatar,
  UserCard,
  UserEmail,
  UserName,
  UserNav,
  UserNavContainer
} from './styled';

type TProps = {
  onLogout?: () => void;
};

const UserProfile: React.FC<TProps> = ({ onLogout }) => {
  const { logOut, user, userName, userEmail } = useFirebaseAuth();

  const userImage =
    (user &&
      `${process.env.REACT_APP_PUBLISHER_IMAGE}/${user.uid}%2Fpictures%2Fsquare_medium.jpeg?alt=media`) ||
    '';

  const handleLogOut = () => {
    logOut();

    if (onLogout) onLogout();
  };

  return (
    <Container>
      <UserCard>
        <UserAvatar src={userImage} />
        <div>
          <UserName>{userName}</UserName>
          <UserEmail>{userEmail}</UserEmail>
        </div>
      </UserCard>

      <Divider light />

      <UserNavContainer>
        <UserNav href="/play/courses">
          <Trans>My Courses</Trans>
        </UserNav>

        <UserNav
          onClick={async () => {
            await getIdToken().then(token => sessionLogin(token));
            window.location.href = `https://profile.${WEB_DOMAIN}/profile_account`;
          }}
        >
          <Trans>My Profile</Trans>
        </UserNav>

        <UserNav href="/manage-subscription">
          <Trans>My Subscription</Trans>
        </UserNav>

        <UserNav onClick={() => handleLogOut()}>
          <Trans>Logout</Trans>
        </UserNav>
      </UserNavContainer>
    </Container>
  );
};

export default UserProfile;
