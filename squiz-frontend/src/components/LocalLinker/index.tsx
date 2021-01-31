import styled from '@emotion/styled';
import useLocalLink from 'hooks/useLocalLink';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface TProps {
  location?: string;
}

const StyledNavLink = styled(NavLink)`
  transition: 0.3s;
  &:hover {
    opacity: 0.6;
  }
`;

const LocalLinker: React.FC<TProps> = ({ location }) => {
  const link = useLocalLink(location);

  if (link) return <StyledNavLink to={link}>{location}</StyledNavLink>;

  return <>{location}</>;
};

export default LocalLinker;
