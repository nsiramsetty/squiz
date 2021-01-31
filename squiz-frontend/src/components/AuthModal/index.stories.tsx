import { Store, withState } from '@sambego/storybook-state';
import { addDecorator, addParameters } from '@storybook/react';
import React from 'react';
import AuthModal from '.';

const store = new Store({
  open: true
});

addDecorator(withState());
addParameters({
  state: {
    store
  }
});

export const normal = (props: any) => {
  return (
    <AuthModal open={props.open} onClose={() => store.set({ open: false })} />
  );
};

export default { title: 'AuthModal' };
