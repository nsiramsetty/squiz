import styled from '@emotion/styled';

export const Popup = styled.div`
  width: 423px;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 28px 40px 32px 40px;
  position: relative;
  height: 80%;
  @media (max-width: 423px) {
    padding: 28px 24px 32px 24px;
    width: 100%;
    min-height: 100vh;
    border-radius: 0px;
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
  @media (max-width: 600px) {
    right: 40px;
    top: calc(50% - 250px);
  }
`;

export const CenterDiv = styled.div<{ centered: boolean }>`
  text-align: ${props => (props.centered ? 'center' : 'left')};
  @media (max-width: 600px) {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
