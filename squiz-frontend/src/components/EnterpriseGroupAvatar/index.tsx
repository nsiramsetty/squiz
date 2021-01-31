import Box from '@material-ui/core/Box';
import React from 'react';

const EnterpriseGroupAvatar: React.FC<{ emailDomain: string }> = ({
  emailDomain
}) => {
  return (
    <Box
      height="100%"
      width="100%"
      bgcolor="#000"
      color="#fff"
      borderRadius="25%"
      fontFamily="ProximaNova"
      textAlign="center"
      fontWeight="700"
      fontSize="55%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {emailDomain && emailDomain[0].toUpperCase()}
    </Box>
  );
};

export default EnterpriseGroupAvatar;
