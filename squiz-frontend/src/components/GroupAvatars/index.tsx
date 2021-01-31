import Box from '@material-ui/core/Box';
import UserAvatar from 'components/UserAvatar';
import React from 'react';
import { GroupSummary } from 'services/groups';
import { getGroupBackground } from 'services/groups/helpers';

const GroupAvatar: React.FC<{ group: GroupSummary }> = ({ group }) => {
  if (group == null)
    return (
      <Box height="80px" width="80px" bgcolor="#dedede" borderRadius="40px" />
    );

  const background = getGroupBackground(group);

  if (background) {
    switch (background.type) {
      case 'PROFILE_IMAGE':
        return <UserAvatar userName={group.name} imageURL={background.src} />;

      case 'CURATED_IMAGE':
        return <UserAvatar userName={group.name} imageURL={background.src} />;

      case 'COLOUR_SOLID':
        return (
          <UserAvatar
            userName={group.name}
            fallbackColor={background.backgroundCSS}
          />
        );

      case 'COLOUR_GRADIENT':
        return (
          <UserAvatar
            userName={group.name}
            fallbackColor={background.backgroundImageCSS}
          />
        );

      default:
        return <UserAvatar userName={group.name} />;
    }
  }

  return <UserAvatar userName={group.name} />;
};

export default GroupAvatar;
