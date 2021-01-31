import { Plural } from '@lingui/macro';
import UserAvatar from 'components/UserAvatar';
import VerticalSpacing from 'components/VerticalSpacing';
import React from 'react';
import { GroupAdmin } from 'services/groups';
import { getUserAvatarUrl } from 'services/user';
import {
  HostContainer,
  HostLeft,
  HostName,
  HostRight,
  MembersCount
} from './styled';

type TProps = {
  firstAdmin?: GroupAdmin;
  memberCount: number;
};

const CircleAdmin: React.FC<TProps> = ({ memberCount, firstAdmin }) => {
  const adminAvatar = firstAdmin && getUserAvatarUrl(firstAdmin.id, 'medium');

  return (
    <HostContainer>
      <HostLeft>
        {/* <Administrator>Administrator</Administrator> */}
        <VerticalSpacing height={10} />
        <HostName>{firstAdmin && firstAdmin.name}</HostName>
        <MembersCount>
          <Plural
            value={memberCount}
            one={`${memberCount} Member in this Circle`}
            other={`${memberCount} Members in this Circle`}
          />
        </MembersCount>
      </HostLeft>
      <HostRight>
        {firstAdmin && (
          <UserAvatar
            userName={firstAdmin.name}
            imageURL={adminAvatar}
            isAdmin
          />
        )}
      </HostRight>
    </HostContainer>
  );
};

export default CircleAdmin;
