import styled from '@emotion/styled';
import Modal from '@material-ui/core/Modal';

export const StyledModal = styled(Modal)``;

export const ModalPaper = styled.div`
  position: absolute;
  outline: 0;
  @media (max-width: 600px) {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  @media (min-width: 600px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const PopupContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
