import ChangePasswordModal from 'components/ChangePasswordModal';
import React, { useState } from 'react';
import StyledButton from './styled';

type TProps = {
  loading: number;
  buttonText?: string;
};

const ManageUserChangePassword: React.FC<TProps> = ({
  loading,
  buttonText
}) => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  return (
    <>
      <StyledButton
        loading={loading}
        onClick={() => setOpenPasswordModal(!openPasswordModal)}
      >
        {buttonText || 'change password'}
      </StyledButton>

      <ChangePasswordModal
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </>
  );
};

export default ManageUserChangePassword;
