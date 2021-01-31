import Box from '@material-ui/core/Box';
import Separator from 'components/Separator';
import UserAvatar from 'components/UserAvatar';
import NumberAvatar from 'components/UserAvatar/NumberAvatar';
import React, { useMemo } from 'react';
import { GroupAdmin, UserSummary } from 'services/groups';
import { getUserAvatarUrl } from 'services/user';
import CircleAdmin from './CircleAdmin';
import { StyledContainer } from './styled';

type TProps = {
  name: string;
  type: 'ENTERPRISE' | 'GROUP';
  privacy_type: 'PRIVATE' | 'PUBLIC';
  long_description: string;
  admins?: GroupAdmin[];
  member_count: number;
  _selected_group_members?: UserSummary[];
};

const CircleDetailsDesktop: React.FC<TProps> = ({
  admins,
  member_count,
  _selected_group_members
}) => {
  const firstAdmin = admins && admins[0];

  const displayMembers = useMemo(() => {
    const members = _selected_group_members
      ? _selected_group_members.filter(
          member => firstAdmin && member.id !== firstAdmin.id
        )
      : [];

    return members.slice(0, 14);
  }, [_selected_group_members, firstAdmin]);

  return (
    <StyledContainer>
      <CircleAdmin firstAdmin={firstAdmin} memberCount={member_count} />

      {displayMembers.length > 0 && <Separator padding={[25, 25]} />}

      <Box width="100%" display="relative">
        <Box display="flex" flexWrap="wrap" margin="-15px">
          {displayMembers.map(member => {
            return (
              <Box width="60px" height="60px" margin="15px">
                <UserAvatar
                  isAdmin={member.is_admin}
                  userName={member.name}
                  imageURL={getUserAvatarUrl(member.id, 'medium')}
                />
              </Box>
            );
          })}
          {member_count > 16 && (
            <Box width="60px" height="60px" margin="15px">
              <NumberAvatar text={`+${member_count - 15}`} />
            </Box>
          )}
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default CircleDetailsDesktop;
