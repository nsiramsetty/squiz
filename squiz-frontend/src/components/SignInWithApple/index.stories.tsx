import Container from '@material-ui/core/Container';
import { action } from '@storybook/addon-actions';
import React from 'react';
import '../../styles/typography.scss';
import SignInWithApple from './index';

export default { title: 'SignInApple' };

export const normal = () => {
  return (
    <Container maxWidth="xs">
      <SignInWithApple
        onComplete={action('onComplete')}
        onSubmit={action('onSubmit')}
      />
    </Container>
  );
};

export const disabled = () => {
  return (
    <Container maxWidth="xs">
      <SignInWithApple
        disabled
        onComplete={action('onComplete')}
        onSubmit={action('onSubmit')}
      />
    </Container>
  );
};
