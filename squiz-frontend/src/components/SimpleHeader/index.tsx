import styled from '@emotion/styled';
import React from 'react';
import AuthNav from './AuthNav';
import LogoNav from './LogoNav';

export const HeaderContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    padding: 25px 10px 25px 35px;
  }
  .MuiButton-root.Mui-disabled {
    color: grey;
  }
`;

const SimpleHeader: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoNav />
      <AuthNav />
    </HeaderContainer>
  );
};

export default SimpleHeader;
