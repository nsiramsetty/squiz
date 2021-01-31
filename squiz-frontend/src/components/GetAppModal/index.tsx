import Modal from '@material-ui/core/Modal';
import AppDownload from 'components_2/base/LibraryItemPromotionTiles/appDownload';
import React from 'react';
import {
  CloseButton,
  CloseWrapper,
  ModalPaper,
  PopupContainer,
  StyledCloseIcon
} from './styled';

interface Props {
  open: boolean;
  onClose: () => void;
}

const GetAppModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Modal open={open} onBackdropClick={onClose}>
      <ModalPaper>
        <PopupContainer>
          <CloseWrapper>
            <CloseButton onClick={onClose}>
              <StyledCloseIcon />
            </CloseButton>
          </CloseWrapper>
          <AppDownload />
        </PopupContainer>
      </ModalPaper>
    </Modal>
  );
};

export default GetAppModal;
