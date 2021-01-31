/* eslint-disable @typescript-eslint/no-empty-function */
import Container from '@material-ui/core/Container';
import React from 'react';
import LiveEventTile from '.';

const liveItem = {
  to: '/',
  id: 'd7w3j7p4u1v0u2b6e8w2y0k7z4m1n9g8t2s1g5e0',
  coverImageId: 'july8sarahblondin',
  publisherName: 'Sarah Blondin',
  publisherUsername: 'sarah-blondin',
  publisherId:
    'P4E8v1s5X1w9a4a3s9k8B1Z0V4C2y9Z6N3d4N6v7M5Z3p4g2c0d0s8E6L8N7W3s7Q6b6u1p0w0E7b6f4R8E9L3Q7w4g1e8s5w9W1',
  status: 'PENDING',
  startAt: 1599707937000,
  title: 'Healing And Realignment',
  numberOfAttendees: 2251,
  onShare: () => {},
  onClick: () => {},
  disabled: false,
  hasEnded: false,
  webUrl:
    'https://insighttimer.com/live/d7w3j7p4u1v0u2b6e8w2y0k7z4m1n9g8t2s1g5e0'
};

export const NewLiveEventTile = () => {
  return (
    <Container maxWidth="xs" className="h-screen">
      <LiveEventTile {...liveItem} />
    </Container>
  );
};

export default { title: 'NewLiveEventTile' };
