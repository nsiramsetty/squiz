import styled from '@emotion/styled';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;

  @media (min-width: 1280px) {
    padding: 24px 32px;
  }
  @media (max-width: 767px) {
    padding: 15px 30px;
  }
`;

export const UserAvatar = styled(Avatar)`
  width: 64px;
  height: 64px;
  margin-right: 20px;
`;

export const UserName = styled.div`
  line-height: 1.25;
  font-family: ProximaNova;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const UserEmail = styled.div`
  line-height: 1.25;
  font-size: 14px;
  font-family: ProximaNova;
`;

export const UserNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  padding: 24px 0 0;

  @media (min-width: 1280px) {
    padding: 24px 32px;
  }
  @media (max-width: 767px) {
    padding: 0 30px;
  }
`;

export const UserNav = styled(Button)`
  color: #6e6e71;
  font-size: 16px;
  font-family: ProximaNova;
  font-weight: 600;
  background: transparent;
  display: block;
  text-align: left;
  padding: 8px 0;
  transition: 0.3s;

  &:hover {
    color: #181818;
    background: transparent;
  }

  &:disabled {
    background: transparent;
    color: #cbcbcb;
  }

  &:focus {
    outline: none;
  }

  @media (min-width: 1280px) {
    padding: 8px;
  }
`;
