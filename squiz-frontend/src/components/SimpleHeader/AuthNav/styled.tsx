import styled from '@emotion/styled';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

export const AuthButton = styled(Button)`
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 25px;
  letter-spacing: 0.5px;
  color: #ffffff;
  width: 100px;
  height: 40px;
  border-radius: 8px;
  background-color: #222222;
  :hover {
    opacity: 0.75;
    background: #222222;
  }
  :focus {
    outline: 0;
  }
  :disabled {
    opacity: 0.5;
    background: #222222;
    color: #ffffff;
  }

  @media (max-width: 600px) {
    background-color: transparent;
    text-decoration: underline;
    color: #222222;
    :hover {
      background-color: transparent;
      color: black;
    }
    :disabled {
      background-color: transparent;
      color: grey;
    }
  }
`;

export const AuthAvatarButton = styled(Button)`
  background: none;
  margin-left: 25px;
  padding: 0;
  min-width: 0;
  :hover,
  :focus {
    outline: 0;
    background: none;
  }
`;

export const AuthAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

export const AuthPopover = styled(Popover)`
  .MuiPopover-paper {
    font-size: 15px;
    box-shadow: 0 9px 20px -2px rgba(0, 0, 0, 0.15);
    margin-top: -10px;
    background-color: #fff;
    padding: 15px;
  }
`;

export const UserName = styled.div`
  font-family: ProximaNova;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: normal;
  color: #000000;
  margin-right: 15px;
  @media (max-width: 600px) {
    display: none;
  }
`;

export const QuestionText = styled.span`
  cursor: pointer;
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: normal;
  color: #9a9a9a;
  margin-right: 20px;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

export const TextLogIn = styled.div``;
