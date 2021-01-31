import styled from '@emotion/styled';
import Modal from '@material-ui/core/Modal';

export const StyledModal = styled(Modal)``;

export const ModalPaper = styled.div`
  position: absolute;
  outline: 0;
  @media (max-width: 423px) {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  @media (min-width: 424px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const PopupContainer = styled.div`
  width: 423px;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 40px;
  position: relative;
  height: 80%;
  text-align: center;
  @media (max-width: 423px) {
    padding: 28px 24px 32px 24px;
    width: 100%;
    min-height: 100vh;
    border-radius: 0px;
    display: flex;
    align-items: center;
  }
`;

export const CloseWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  -webkit-backdrop-filter: blur(27.2px);
  backdrop-filter: blur(27.2px);
  background-color: #f5f5f5;
  position: absolute;
  left: 15px;
  top: 15px;
  @media (max-width: 423px) {
    right: 40px;
    top: calc(50% - 250px);
  }
`;

export const PopupInner = styled.div`
  width: 100%;
`;
