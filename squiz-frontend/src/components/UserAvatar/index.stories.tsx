import Container from '@material-ui/core/Container';
import React from 'react';
import UserAvatar from './index';

export const Avatar = () => {
  return (
    <Container>
      <div style={{ width: '60px', height: '60px', paddingTop: '40px' }}>
        <UserAvatar userName="Jenna" isAdmin />
      </div>
    </Container>
  );
};

export default { title: 'UserAvatar' };
