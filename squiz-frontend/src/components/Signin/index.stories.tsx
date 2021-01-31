import styled from '@emotion/styled';
import React from 'react';
import Signin from '.';

const Container = styled.div`
  max-width: 340px;
`;
export const SigninComponent = () => {
  return (
    <Container className="mt-10 ml-4">
      <Signin />
    </Container>
  );
};

export default { title: 'SigninComponent' };
