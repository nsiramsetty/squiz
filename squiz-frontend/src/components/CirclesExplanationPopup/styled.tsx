import styled from '@emotion/styled';

export const ModalPaper = styled.div`
  position: fixed;
  outline: 0;
  padding: 46px 24px 35px 23px;
  width: 300px;
  height: 385px;
  border-radius: 10px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  z-index: 1000;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
