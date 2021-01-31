import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';

export const StyledModal = styled(Modal)``;

export const ModalPaper = styled.div`
  position: absolute;
  outline: 0;
  max-width: 500px;
  height: 580px;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const PopupContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CloseWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 50;
  padding: 12px;
`;

export const CloseButton = styled(IconButton)`
  color: #fff;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(50px);
  height: 40px;
  width: 40px;
  transition: 0.3s;
  &:hover {
    color: #fff;
  }
`;

export const StyledCloseIcon = styled(CloseIcon)`
  height: 20px;
  width: 20px;
`;
