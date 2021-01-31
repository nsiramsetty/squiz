import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

export const CloseButton = styled(Button)`
  width: 50px;
  height: 50px;
  border-radius: 100px;
  background-color: #ececec;
  position: fixed;
  z-index: 1000;
  right: 30px;
  bottom: 30px;
  min-width: 0px;
  outline: 0;
  :focus {
    outline: 0;
  }
  :hover {
    background-color: #cac6c6;
  }
  svg {
    width: 13px;
    height: 13px;
  }
`;

export const QuestionButton = styled(Button)`
  width: 50px;
  height: 50px;
  border-radius: 100px;
  box-shadow: 0 3px 6px 0 rgba(96, 96, 96, 0.25);
  background-color: #ffffff;
  font-size: 22px;
  font-weight: 600;
  line-height: 50px;
  color: #9a9a9a;
  position: fixed;
  z-index: 9999;
  right: 30px;
  bottom: 30px;
  min-width: 0px;
  :focus {
    outline: 0;
  }
  :hover {
    background-color: #cac6c6;
  }
`;

export const ModalPaper = styled.div`
  position: fixed;
  outline: 0;
  padding: 46px 24px 35px 23px;
  width: 300px;
  height: 385px;
  border-radius: 10px;
  box-shadow: 0 4px 10px 0 #dedddb;
  background-color: #ffffff;
  z-index: 1000;
  right: 30px;
  bottom: 93px;
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
