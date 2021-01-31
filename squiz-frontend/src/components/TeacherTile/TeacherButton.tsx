import styled from '@emotion/styled';
import Button, { ButtonProps } from '@material-ui/core/Button';
import React from 'react';

const StyledButton = styled(Button)<ButtonProps>`
  width: 100%;
  position: relative;
  border-radius: 7px !important;
  margin-top: 10px;
  padding: 0;
  z-index: 20;
  overflow: hidden !important;
  transition: 0.4s;
  text-transform: none !important;
  :hover,
  :focus,
  :active {
    background-color: transparent;
  }
  @media (min-width: 960px) {
    :hover {
      transform: translate(0, -8px);
      box-shadow: 0 10px 40px -10px rgba(24, 24, 24, 0.5);
    }
  }
`;

const StyledTileButton: React.FC<ButtonProps> = ({
  children,
  href,
  className,
  onClick
}) => {
  return (
    <StyledButton href={href} className={className} onClick={onClick}>
      {children}
    </StyledButton>
  );
};
export default StyledTileButton;
