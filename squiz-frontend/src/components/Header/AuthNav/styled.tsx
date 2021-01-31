import styled from '@emotion/styled';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

export const AuthButton = styled(Button)`
  border-radius: 6px;
  font-family: ProximaNova;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: -0.1px;
  color: #ffffff;
  background: #181818;
  margin-left: 26px;
  transition: 0.4s;
  height: 40px;
  letter-spacing: 0.22px;
  padding: 6px 32px;
  &:hover {
    opacity: 0.75;
    background: #181818;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    background: #181818;
    color: #ffffff;
  }
`;

export const AuthAvatarButton = styled(Button)`
  background: none;
  margin-left: 25px;
  padding: 0;
  min-width: 0;
  padding-right: 3px;

  &:hover,
  &:focus {
    background: none;
    outline: none;
  }
`;

export const AuthAvatar = styled(Avatar)`
  width: 38px;
  height: 38px;
  margin-right: 8px;
`;

export const AuthUsername = styled.span`
  font-family: ProximaNova;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 4px;
  margin-right: 11px;
  text-overflow: hidden;
  max-width: 200px;
`;

export const AuthPopover = styled(Popover)`
  .MuiPopover-paper {
    font-size: 15px;
    box-shadow: 0 9px 20px -2px rgba(0, 0, 0, 0.15);
    margin-top: -10px;
    background-color: #fff;
  }
`;
