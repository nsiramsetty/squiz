import styled from '@emotion/styled';
import { useNotification } from 'hooks/useNotification';
import React from 'react';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
  display: inline;
  transition: 0.3s;
  font-weight: 600;
  font-family: ProximaNova;
  color: #fff;
  padding-left: 8px;
  text-align: center;
  :hover {
    opacity: 0.75;
  }
`;

interface Props {
  to: string;
}

const NotifyLink: React.FC<Props> = ({ to, children }) => {
  const { onClose } = useNotification();

  return (
    <StyledLink to={to} onClick={onClose}>
      {children}
    </StyledLink>
  );
};

export default NotifyLink;
