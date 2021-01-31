import Modal from '@material-ui/core/Modal';
import { PopupContainer } from 'components/AuthModal/styled';
import CirclesExplanationPopup from 'components/CirclesExplanationPopup';
import React, { useCallback, useContext, useState } from 'react';

export const CirclesExplanationContext = React.createContext<{
  showCirclesExplanation: () => void;
  hideCirclesExplanation: () => void;
}>({ showCirclesExplanation: () => null, hideCirclesExplanation: () => null });

export const CirclesExplanationModalProvider: React.FC = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const showCirclesExplanation = useCallback(() => setShowModal(true), []);
  const hideCirclesExplanation = useCallback(() => setShowModal(false), []);

  return (
    <CirclesExplanationContext.Provider
      value={{ showCirclesExplanation, hideCirclesExplanation }}
    >
      <Modal open={showModal} onBackdropClick={hideCirclesExplanation}>
        <PopupContainer>
          <CirclesExplanationPopup onClose={hideCirclesExplanation} />
        </PopupContainer>
      </Modal>
      {children}
    </CirclesExplanationContext.Provider>
  );
};

const useModalCirclesExplanation = () => useContext(CirclesExplanationContext);

export default useModalCirclesExplanation;
