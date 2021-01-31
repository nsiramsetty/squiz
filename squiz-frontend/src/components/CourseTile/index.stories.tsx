import Container from '@material-ui/core/Container';
import React from 'react';
import 'tailwind.css';
import CourseTile from './index';

const item = {
  to: '/',
  teacherLink: '/',
  slug: 'yoga-nidra-for-sleepy-time',
  id: 'd7w3j7p4u1v0u2b6e8w2y0k7z4m1n9g8t2s1g5e0',
  title: 'Yoga Nidra For Sleep',
  publisher: {
    id: 'id',
    name: 'Jennifer Piercy',
    username: '/jenpierce'
  },
  days: 10,
  rating_score: 4.69,
  rating_count: 1247,
  lazyLoadInView: true,
  onClick: () => {}
};

export const NewCourseTile = () => {
  return (
    <Container maxWidth="xs" className="h-screen">
      <CourseTile {...item} />
    </Container>
  );
};

export default { title: 'NewCourseTile v2' };
