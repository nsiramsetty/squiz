import ManageUserChangePassword from 'components/ManageUserChangePassword';
import VerticalSpacing from 'components/VerticalSpacing';
import React from 'react';
import {
  StyledAvatar,
  StyledButton,
  StyledContainer,
  StyledLocation,
  StyledTitle
} from './styled';

type TProps = {
  loading: boolean;
  userId: string | null;
  name: string | null;
  location: string;
};

const ManageUserProfile: React.FC<TProps> = ({
  loading,
  userId,
  name,
  location
}) => {
  const StyledLoading = loading ? 1 : 0;
  const avatar = `${process.env.REACT_APP_PUBLISHER_IMAGE}/${userId}%2Fpictures%2Fsquare_medium.jpeg?alt=media`;

  return (
    <StyledContainer>
      <StyledTitle loading={StyledLoading}>{name}</StyledTitle>

      <StyledLocation loading={StyledLoading}>{location}</StyledLocation>

      <VerticalSpacing height={[20, 20, 20, 20]} />

      <StyledAvatar loading={StyledLoading} src={avatar} />

      <VerticalSpacing height={[20, 20, 20, 20]} />

      <StyledButton loading={StyledLoading}>edit profile</StyledButton>

      <ManageUserChangePassword loading={StyledLoading} />
    </StyledContainer>
  );
};

export default ManageUserProfile;
