import styled from '@emotion/styled';
import { ReactComponent as CloseIcon } from 'assets_2/icons/close-icon.svg';
import CirclesExplanation from 'components/CirclesExplanation';
import React from 'react';
import { ModalContainer, ModalPaper } from './styled';

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 16px;
  height: 16px;
  :focus {
    outline: 0;
  }
  :hover {
    background-color: transparent;
  }
`;

type TProps = {
  onClose?(): void;
};
const CirclesExplanationPopup: React.FC<TProps> = ({ onClose }) => {
  return (
    <ModalPaper>
      {onClose != null && (
        <CloseButton onClick={onClose}>
          <CloseIcon width="16px" />
        </CloseButton>
      )}
      <ModalContainer>
        <CirclesExplanation />
      </ModalContainer>
    </ModalPaper>
  );
};

export default CirclesExplanationPopup;
