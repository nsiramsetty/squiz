import React from 'react';
import { Badge, DefaultAvatar, StyledAvatar, StyledContainer } from './styled';

type TProps = {
  userName: string;
  isAdmin?: boolean;
  fallbackColor?: string;
  fallbackFontSize?: string;
  imageURL?: string;
};

const UserAvatar: React.FC<TProps> = ({
  userName,
  isAdmin,
  imageURL,
  fallbackColor,
  fallbackFontSize
}) => {
  return (
    <StyledContainer>
      <StyledAvatar alt={userName} src={imageURL}>
        <DefaultAvatar bgColor={fallbackColor} fontSize={fallbackFontSize}>
          <p>{userName && userName.charAt(0).toUpperCase()}</p>
        </DefaultAvatar>
      </StyledAvatar>
      {isAdmin ? <Badge> ADMIN </Badge> : null}
    </StyledContainer>
  );
};

export default UserAvatar;
