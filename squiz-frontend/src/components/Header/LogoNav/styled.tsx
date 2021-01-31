import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

export const StyledLogoNav = styled(NavLink)`
  display: flex;
  align-items: center;

  @media (min-width: 1280px) {
    width: 188px;
  }
`;

export const StyledBowlLogo = styled.img`
  width: 48px;
  margin-right: 12px;
  display: none;

  @media (min-width: 1280px) {
    display: block;
  }
`;

export const StyledTextLogo = styled.img`
  height: 17px;

  @media (min-width: 1280px) {
    height: 24px;
  }
`;
