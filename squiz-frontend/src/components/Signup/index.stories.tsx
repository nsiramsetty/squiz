import styled from '@emotion/styled';
import { addDecorator } from '@storybook/react';
import React from 'react';
import StoryRouter from 'storybook-react-router';
import Signup from '.';

addDecorator(StoryRouter());

const Container = styled.div`
  max-width: 340px;
`;
export const SignupComponent = () => {
  return (
    <Container className="mt-10 ml-4">
      <Signup />
    </Container>
  );
};

export default { title: 'SignupComponent' };
