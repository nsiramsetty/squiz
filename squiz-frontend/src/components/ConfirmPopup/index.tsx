import styled from '@emotion/styled';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from 'components_2/base/Modal';
import React from 'react';

interface TProps {
  open: boolean;
  title: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Container = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  max-width: 550px;
  @media (max-width: 600px) {
    padding: 25px;
  }
`;

const Head = styled.h2`
  font-size: 26px;
  line-height: 1.3;
  font-weight: 700;
  font-family: ProximaNova;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    font-size: 24px;
    line-height: 1.2;
  }
`;

const Content = styled.div`
  margin-bottom: 45px;
  font-size: 16px;
  font-family: ProximaNova;
  line-height: 1.5;
  p {
    margin-bottom: 10px;
  }
  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const Foot = styled.div`
  text-align: right;
`;

const ConfirmButton = styled(Button)<ButtonProps>`
  font-weight: 600;
  font-family: ProximaNova;
  height: 44px;
  transition: 0.7s;
  border-radius: 6px;
  letter-spacing: 0.22px;
  padding-left: 24px;
  padding-right: 24px;
  line-height: 1;
  background: #181818;
  color: #fff;
  font-size: 18px;
  margin-right: 10px;
  min-width: 114px;
  &:hover {
    opacity: 0.75;
    background: #181818;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const CancelButton = styled(Button)<ButtonProps>`
  font-weight: 400;
  font-family: ProximaNova;
  height: 44px;
  border-radius: 6px;
  letter-spacing: 0.22px;
  transition: 0.5s;
  padding-left: 24px;
  padding-right: 24px;
  line-height: 1;
  font-size: 18px;
  color: #888;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const StyledCircularProgress = styled(CircularProgress)`
  color: #fff;
`;

const ConfirmPopup: React.FC<TProps> = ({
  open,
  title,
  children,
  loading,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}) => {
  const confirmButtonText = confirmText || 'Confirm';
  const cancelButtonText = cancelText || 'Cancel';

  return (
    <Modal open={open}>
      <Container>
        <Head>{title}</Head>
        <Content>{children}</Content>
        <Foot>
          <ConfirmButton onClick={onConfirm}>
            {loading ? <StyledCircularProgress size={19} /> : confirmButtonText}
          </ConfirmButton>
          <CancelButton onClick={onCancel}>{cancelButtonText}</CancelButton>
        </Foot>
      </Container>
    </Modal>
  );
};

export default ConfirmPopup;
