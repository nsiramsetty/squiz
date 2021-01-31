import Modal from '@material-ui/core/Modal';
import ChangePasswordForm from 'components/ChangePasswordForm';
import VerticalSpacing from 'components/VerticalSpacing';
import React from 'react';
import { ReactComponent as CloseIcon } from './CloseIcon.svg';
import { CloseWrapper, ModalPaper, PopupContainer, PopupInner } from './styled';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Modal open={open} onBackdropClick={onClose}>
      <ModalPaper>
        <PopupContainer>
          <PopupInner>
            <CloseWrapper>
              <CloseIcon onClick={onClose} />
            </CloseWrapper>

            <VerticalSpacing height={8} />

            <ChangePasswordForm onSuccess={onClose} />
          </PopupInner>
        </PopupContainer>
      </ModalPaper>
    </Modal>
  );
};

export default ChangePasswordModal;
