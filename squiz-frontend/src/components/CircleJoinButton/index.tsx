import CircularProgress from '@material-ui/core/CircularProgress';
import LockIcon from 'assets_2/icons/circle/lock-icon.svg';
import { useGroupContext } from 'context/GroupContext';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useGroupJoinMutation } from 'hooks/queries/useGroupJoinMutation';
import { useAuthPopup } from 'hooks/useAuthPopup';
import { AuthState, useFirebaseAuth } from 'hooks/useFirebaseAuth';
import usePrevious from 'hooks/usePrevious';
import { getIdToken, sessionLogin } from 'lib/firebase/auth';
import {
  CircleFields,
  ClickedEventNames,
  InteractionLocations,
  PageTypes
} from 'lib/mparticle/enums';
import { logClicked } from 'lib/mparticle/loggers';
import { trackEvent } from 'lib/mparticle/trackEvents';
import { MParticleEventType } from 'lib/mparticle/types';
import React, { useCallback, useEffect, useState } from 'react';
import { GroupSummary } from 'services/groups';
import {
  getGroupHost,
  isEnterprise,
  isInvited,
  isPrivate
} from 'services/groups/helpers';
import { StyledButton, StyledLockIcon, StyledText } from './styled';

const RequestToJoinText = () => {
  return (
    <StyledText>
      <StyledLockIcon src={LockIcon} alt="request to join" />
      Request to join
    </StyledText>
  );
};

const JoinText = () => {
  return <StyledText>Join this circle</StyledText>;
};

const CircleJoinButton: React.FC<{ group: GroupSummary }> = ({ group }) => {
  const { showSignupPopup } = useAuthPopup();
  const { authState } = useFirebaseAuth();
  const prevAuthState = usePrevious<AuthState>(authState);
  const {
    groupRelation,
    loadGroupRelation,
    setRequestToJoin
  } = useGroupContext();
  const { loading, joinGroup } = useGroupJoinMutation();
  const [processJoinOnAuth, setProcessJoinOnAuth] = useState(false);
  const { pageType } = usePageViewTracker();

  const isPrivateGroup = isPrivate(group);
  const isEnterpriseGroup = isEnterprise(group);
  const wasInvited = isInvited(groupRelation);

  const logGroupJoinCta = useCallback(
    (buttonText: string) => {
      logClicked(
        ClickedEventNames.CTA_JoinGroup,
        pageType,
        buttonText,
        InteractionLocations.Body,
        {
          [CircleFields.GroupId]: group.id,
          [CircleFields.GroupName]: group.name,
          [CircleFields.GroupType]: group.privacy_type.toLowerCase(),
          [CircleFields.GroupHostId]: getGroupHost(group).id,
          [CircleFields.GroupIsWorkplace]: isEnterprise(group),
          [CircleFields.GroupEmailDomain]:
            group.email_domains && group.email_domains[0]
        }
      );
    },
    [group, pageType]
  );

  const handleJoinGroup = useCallback(async () => {
    // const button = e.target as HTMLButtonElement;

    if (isEnterpriseGroup) {
      await getIdToken()
        .then(token => sessionLogin(token))
        .then(() => {
          window.location.href = `https://web.insighttimer.com/circles/${group?.id}?verify`;
        });
    } else {
      const result = await joinGroup(group.id);
      if (result.success && group != null) {
        loadGroupRelation();
        setRequestToJoin();
        trackEvent({
          event_name: 'group_join_requested',
          event_type: MParticleEventType.Navigation,
          page_path: window.location.pathname,
          page_domain: window.location.hostname,
          page_type: PageTypes.CircleGroupPage,
          group_id: group.id,
          group_name: group.name,
          group_type: group.privacy_type,
          group_host_user_id: group.admins && group.admins[0]?.id,
          interaction_location: 'group_page_web',
          group_is_workplace: isEnterprise(group),
          email_domain: group.email_domains && group.email_domains[0]
        });
      }
    }
  }, [
    group,
    joinGroup,
    loadGroupRelation,
    setRequestToJoin,
    isEnterpriseGroup
  ]);

  useEffect(() => {
    if (
      authState === AuthState.AUTHORIZED &&
      prevAuthState !== AuthState.AUTHORIZED
    ) {
      if (processJoinOnAuth) {
        handleJoinGroup();
        setProcessJoinOnAuth(false);
      }
    }
  }, [
    prevAuthState,
    authState,
    processJoinOnAuth,
    joinGroup,
    setProcessJoinOnAuth,
    isEnterpriseGroup,
    group,
    handleJoinGroup
  ]);

  if (loading) {
    return (
      <StyledButton
        onClick={event => logGroupJoinCta(event?.currentTarget?.innerText)}
      >
        <CircularProgress size={16} />
      </StyledButton>
    );
  }

  if (authState === AuthState.AUTHORIZED) {
    return (
      <StyledButton
        onClick={event => {
          logGroupJoinCta(event?.currentTarget?.innerText);
          handleJoinGroup();
        }}
      >
        {isPrivateGroup && !wasInvited ? <RequestToJoinText /> : <JoinText />}
      </StyledButton>
    );
  }

  if (authState === AuthState.UNAUTHORIZED) {
    return (
      <StyledButton
        onClick={event => {
          logGroupJoinCta(event?.currentTarget?.innerText);
          trackEvent({
            event_name: 'registration_popup_triggered',
            event_type: MParticleEventType.Navigation,
            page_type: PageTypes.CircleGroupPage,
            interaction_location: 'join_group_requested_web'
          });
          showSignupPopup();
          setProcessJoinOnAuth(true);
        }}
      >
        {isPrivateGroup ? <RequestToJoinText /> : <JoinText />}
      </StyledButton>
    );
  }

  return null;
};

export default CircleJoinButton;
