import styled from '@emotion/styled';
import React from 'react';

const ErrorMessageContainer = styled.div`
  min-height: 34px;
  display: flex;
  align-items: center;
  margin-left: 2px;
`;

const StyledText = styled.p`
  margin-top: 5px;
  margin-bottom: 3px;
  font-family: ProximaNova;
  font-weight: normal;
  font-size: 14px;
  color: red;
`;

const ErrorMessage: React.FC = ({ children }) => {
  return (
    <ErrorMessageContainer>
      <StyledText>{children}</StyledText>
    </ErrorMessageContainer>
  );
};

export default ErrorMessage;
