import Container from '@material-ui/core/Container';
import { addDecorator } from '@storybook/react';
import React from 'react';
import StoryRouter from 'storybook-react-router';
import TileButton from './index';

addDecorator(StoryRouter());

export const Normal = () => {
  return (
    <Container>
      <div style={{ width: '200px', paddingTop: '40px' }}>
        <TileButton
          to="https://insighttimer.com"
          paddingtop={['120%', '120%']}
          bgImage="https://users.insighttimer-api.net/f3Q1S2e7f0C9e7n3L3T6Z9c0y9x9P0w1q8n6q8T1e0x2y2z3X2W8y9E8D0Z8P3j2e0c0a9G8x7a1K3c6j2k7v7d0L9E9x8T3Y9L4%2Fpictures%2Fsquare_large.jpeg?alt=media"
          bgImageMobile="https://users.insighttimer-api.net/f3Q1S2e7f0C9e7n3L3T6Z9c0y9x9P0w1q8n6q8T1e0x2y2z3X2W8y9E8D0Z8P3j2e0c0a9G8x7a1K3c6j2k7v7d0L9E9x8T3Y9L4%2Fpictures%2Fsquare_medium.jpeg?alt=media"
        >
          <div
            style={{ position: 'absolute', bottom: 0, left: 0, width: 'auto' }}
          >
            Some Text
          </div>
        </TileButton>
      </div>
    </Container>
  );
};

export default { title: 'TileButton' };
