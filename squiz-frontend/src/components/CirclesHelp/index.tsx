import { ReactComponent as CloseIcon } from 'assets_2/icons/close-icon.svg';
import CirclesExplanation from 'components/CirclesExplanation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CloseButton,
  ModalContainer,
  ModalPaper,
  QuestionButton
} from './styled';

type TProps = {
  defaultIsOpen: boolean;
};
export const CirclesHelp: React.FC<TProps> = ({ defaultIsOpen }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleDefaultShowModal = useCallback(() => {
    setShowModal(true);
  }, []);
  useEffect(() => {
    if (defaultIsOpen) {
      setTimeout(handleDefaultShowModal, 1500);
    }
  }, [handleDefaultShowModal, defaultIsOpen]);

  return (
    <>
      {showModal ? (
        <>
          <ModalPaper>
            <ModalContainer>
              <CirclesExplanation />
            </ModalContainer>
          </ModalPaper>
          <CloseButton onClick={() => setShowModal(false)}>
            <CloseIcon />
          </CloseButton>
        </>
      ) : (
        <QuestionButton onClick={() => setShowModal(true)}>?</QuestionButton>
      )}
    </>
  );
};

export default CirclesHelp;
