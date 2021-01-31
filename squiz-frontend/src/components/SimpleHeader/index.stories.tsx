import styled from '@emotion/styled';
import React from 'react';
import SimpleHeader from '.';

const Container = styled.div`
  max-width: 100%;
`;
export const SimpleHeaderComponent = () => {
  return (
    <Container>
      <SimpleHeader />
    </Container>
  );
};

export default { title: 'SimpleHeader' };
