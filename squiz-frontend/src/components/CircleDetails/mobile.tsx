import Box from '@material-ui/core/Box';
import UserAvatar from 'components/UserAvatar';
import NumberAvatar from 'components/UserAvatar/NumberAvatar';
import chunk from 'lodash/chunk';
import React from 'react';
import { GroupAdmin, UserSummary } from 'services/groups';
import { getUserAvatarUrl } from 'services/user';
import CircleAdmin from './CircleAdmin';

type TProps = {
  name: string;
  type: 'ENTERPRISE' | 'GROUP';
  privacy_type: 'PRIVATE' | 'PUBLIC';
  long_description: string;
  admins?: GroupAdmin[];
  member_count: number;
  _selected_group_members?: UserSummary[];
};

const CircleDetailsMobile: React.FC<TProps> = ({
  admins,
  member_count,
  _selected_group_members
}) => {
  const firstAdmin = admins && admins[0];

  if (member_count === 1) {
    return <CircleAdmin firstAdmin={firstAdmin} memberCount={member_count} />;
  }

  const displayMembers = _selected_group_members
    ? _selected_group_members.filter(
        member => firstAdmin && member.id !== firstAdmin.id
      )
    : [];

  const grid = displayMembers.slice(0, 7).map(member => {
    return (
      <Box width="60px" height="60px">
        <UserAvatar
          isAdmin={member.is_admin}
          userName={member.name}
          imageURL={getUserAvatarUrl(member.id, 'medium')}
        />
      </Box>
    );
  });

  // insert admin
  grid[0] = (
    <Box width="60px" height="60px">
      <UserAvatar
        isAdmin
        userName={firstAdmin?.name || ''}
        imageURL={firstAdmin && getUserAvatarUrl(firstAdmin.id, 'medium')}
      />
    </Box>
  );

  // add number avatar
  if (displayMembers.length > 8) {
    grid.push(
      <Box width="60px" height="60px">
        <NumberAvatar text={`+${member_count - 8}`} />
      </Box>
    );
  }

  // fill first row
  while (grid.length < 4) {
    grid.push(<Box width="60px" height="60px" />);
  }

  // fill 2nd row
  if (grid.length > 4) {
    while (grid.length < 8) {
      grid.push(<Box width="60px" height="60px" />);
    }
  }

  return (
    <Box width="100%" display="relative">
      <Box width="100%" display="flex" flexWrap="wrap" margin="-15px 0px">
        {chunk(grid, 4).map(chunks => (
          <Box
            width="100%"
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            margin="15px 0px"
          >
            {chunks.map(members => members)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CircleDetailsMobile;
