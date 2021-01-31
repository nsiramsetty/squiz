import Container from '@material-ui/core/Container';
import { Store, withState } from '@sambego/storybook-state';
import { action } from '@storybook/addon-actions';
import { addDecorator, addParameters } from '@storybook/react';
import React from 'react';
import AudioSlider from './index';

const store = new Store({
  position: 10,
  handleChange: (e: any, v: any) => store.set({ position: v }),
});

addDecorator(withState());
addParameters({
  state: {
    store,
  },
});

export const Normal = (props: any) => {
  console.log(props.position);
  return (
    <Container>
      <div style={{ padding: '50px', backgroundColor: '#888888' }}>
        <AudioSlider
          onChange={props.handleChange}
          max={100}
          value={props.position}
          onMouseDown={action('onMouseDown')}
          onMouseUp={action('onMouseUp')}
        />
      </div>
    </Container>
  );
};

export const Disabled = (props: any) => {
  return (
    <Container>
      <div style={{ padding: '50px', backgroundColor: '#888888' }}>
        <AudioSlider
          onChange={props.handleChange}
          max={100}
          value={props.position}
          onMouseDown={action('onMouseDown')}
          onMouseUp={action('onMouseUp')}
          disabled
        />
      </div>
    </Container>
  );
};

export default { title: 'AudioSlider' };
