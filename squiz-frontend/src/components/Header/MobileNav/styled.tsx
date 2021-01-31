import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';

export const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    display: block;
    padding: 0 30px;
    min-height: 100vh;

    @media (min-width: 601px) {
      padding: 0 40px;
    }
  }
`;

export const StyledNav = styled(NavLink)<{
  small?: number;
  color: string;
}>`
  font-family: ProximaNova;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: 0.27px;
  display: flex;
  align-items: center;
  padding: 6px 24px;
  font-weight: 600;
  color: ${props => props.color};
  font-size: ${props => (props.small ? 16 : 20)}px;

  &:hover {
    color: #181818;
  }
`;

export const SignUpButton = styled(Button)`
  border-radius: 4px;
  font-family: ProximaNova;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  color: #ffffff;
  background: #181818;
  transition: 0.4s;
  height: 40px;
  padding: 4px 4px 5px 4px;
  letter-spacing: 0.6px;
  width: 100%;

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

export const MobileButton = styled(IconButton)`
  height: auto;
  width: auto;
  padding: 0;
  &:focus {
    outline: none;
  }
`;

export const MenuContainer = styled.div`
  ul {
    li {
      padding: 10px 0;

      a {
        padding: 0;
      }

      ul {
        padding-top: 10px;
        padding-left: 20px;

        li {
          padding: 8px 0;
        }
      }
    }
  }
`;

export const Text = styled.p`
  color: #fff;
  font-family: ProximaNova;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.24px;
  text-align: center;
`;

export const MenuIconWhite = styled(MenuIcon)`
  fill: #fff;
`;
