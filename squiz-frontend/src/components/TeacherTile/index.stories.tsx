import Container from '@material-ui/core/Container';
import moment from 'moment';
import React from 'react';
import 'tailwind.css';
import TeacherTile from './';

const item = {
  to: '/',
  id:
    'z9e8f6Z8k5z4B7e6v3e8U3S1z2U4j4r4T5S2K7p5q7U1Z6g3b8n9g5b1b8X5Q1g2C3V0J8x0C4U0s4s4Q6T7L4J0R5M1d3V3w3F9',
  name: 'user name',
  location: 'location',
  username: 'username',
  createdAt: moment.now().valueOf(),
  lazyLoadInView: true,
  onClick: () => {}
};

export const NewTeacherTile = () => {
  return (
    <Container maxWidth="xs" className="h-screen">
      <div style={{ width: '200px' }}>
        <TeacherTile
          to={item.to}
          id={item.id}
          name={item.name}          
          createdAt={item.createdAt}
          location={item.location}
          lazyLoadInView={true}
        />
      </div>
    </Container>
  );
};

export default { title: 'TeacherTile' };
