import styled from '@emotion/styled';

export const ResetPasswordDiv = styled.div`
  min-height: 90vh;
  position: relative;
`;

export const FormContainer = styled.div`
  text-align: center;
  max-width: 450px;
  margin: auto;
  top: 50%;
  left: 50%;
  position: absolute;
  width: 100%;
  transform: translate(-50%, -50%);
`;

export const PasswordHeadingDiv = styled.div`
  font-size: 16px;
  font-weight: normal;
`;

export const EmailAddressDiv = styled.div`
  font-family: ProximaNova;
  font-size: 16px;
  line-height: 25px;
  font-weight: 700;
`;

export const SuccessMessageDiv = styled.div`
  color: green;
  text-align: left;
  font-size: 16px;
  line-height: normal;
`;

export const MessageContainerDiv = styled.div`
  height: 34px;
  line-height: 34px;
  font-weight: normal;
  font-size: 14px;
  margin-left: 2px;
`;

export const PasswordHintDiv = styled.div`
  color: rgba(24, 24, 24, 0.8);
  text-align: left;
`;

export const ErrorMessageDiv = styled.div`
  color: red;
  text-align: left;
  font-size: 16px;
  line-height: normal;
`;
