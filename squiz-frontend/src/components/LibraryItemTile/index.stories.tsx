import Container from '@material-ui/core/Container';
import React from 'react';
import 'tailwind.css';
import LibraryItemTile, { TProps } from './index';

const item: TProps = {
  content_type: 'MUSIC',
  teacherLink: '/',
  to: '/',
  id: 'd7w3j7p4u1v0u2b6e8w2y0k7z4m1n9g8t2s1g5e0',
  title: 'Yoga Nidra For Sleep',
  publisher: {
    id: 'id',
    name: 'Jennifer Piercy',
    username: '/jenpierce'
  },
  media_length: 1800,
  rating_score: 4.69,
  rating_count: 1247,
  lazyLoadInView: true,
  onClick: () => {}
};

export const NewLibraryItemTile = () => {
  return (
    <Container maxWidth="xs" className="h-screen">
      <LibraryItemTile {...item} />
    </Container>
  );
};

export default { title: 'NewLibraryItemTile v2' };
