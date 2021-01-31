import styled from '@emotion/styled';
import Box from '@material-ui/core/Box';
import { ReactComponent as VerifiedBadge } from 'assets_2/icons/circle/verified-badge.svg';
import EnterpriseGroupAvatar from 'components/EnterpriseGroupAvatar';
import GroupAvatar from 'components/GroupAvatars';
import UserAvatar from 'components/UserAvatar';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { GroupSummary } from 'services/groups';
import {
  getEmailDomain,
  getGroupHost,
  getMemberAvatarUrl,
  isEnterprise
} from 'services/groups/helpers';

const StyledSpan = styled.span`
  font-family: ProximaNova;
  font-size: 16px;
  color: #5a5a5a;
  margin-left: 5px;
`;

const CircleGroupAvatar: React.FC<{ group: GroupSummary | undefined }> = ({
  group
}) => {
  if (group == null) return null;

  const host = getGroupHost(group);
  const hostAvatarURL = getMemberAvatarUrl(host);
  const isEnterpriseGroup = isEnterprise(group);
  const verifiedDomain = getEmailDomain(group);

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box height="80px" width="80px" position="relative">
        <GroupAvatar group={group} />

        {isEnterpriseGroup ? (
          <Box
            right={-5}
            bottom={0}
            position="absolute"
            width="35px"
            height="35px"
            border="2px solid #fff"
            borderRadius="25%"
            fontSize="35px"
          >
            <EnterpriseGroupAvatar emailDomain={verifiedDomain} />
          </Box>
        ) : (
          <Box
            right={-5}
            bottom={0}
            position="absolute"
            width="35px"
            height="35px"
            border="2px solid #fff"
            borderRadius="30px"
          >
            <UserAvatar
              userName={host.name}
              imageURL={hostAvatarURL}
              fallbackFontSize="18px"
            />
          </Box>
        )}
      </Box>

      {isEnterpriseGroup && (
        <Box paddingTop="10px" display="flex" alignItems="center">
          <VerifiedBadge />{' '}
          <StyledSpan>{capitalize(verifiedDomain)}</StyledSpan>
        </Box>
      )}
    </Box>
  );
};

export default CircleGroupAvatar;
