import Container from '@material-ui/core/Container';
import { action } from '@storybook/addon-actions';
import React from 'react';
import '../../styles/typography.scss';
import SignInFacebook from './index';

export default { title: 'SignInFacebook' };

export const normal = () => {
  return (
    <Container maxWidth="xs">
      <SignInFacebook
        onComplete={action('onComplete')}
        onSubmit={action('onSubmit')}
      />
    </Container>
  );
};

export const disabled = () => {
  return (
    <Container maxWidth="xs">
      <SignInFacebook
        disabled
        onComplete={action('onComplete')}
        onSubmit={action('onSubmit')}
      />
    </Container>
  );
};
