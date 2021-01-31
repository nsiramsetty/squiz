import Modal from '@material-ui/core/Modal';
import AuthPopup from 'components/AuthPopup';
import { useAuthPopup } from 'hooks/useAuthPopup';
import { AuthState, useFirebaseAuth } from 'hooks/useFirebaseAuth';
import usePrevious from 'hooks/usePrevious';
import React, { useEffect } from 'react';
import { ModalPaper, PopupContainer } from './styled';

interface Props {
  startScreen?: 'login' | 'signup';
  open: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
  prefillEmail?: string;
}

const AuthModal: React.FC<Props> = ({
  open,
  startScreen,
  prefillEmail,
  onClose,
  onAuthenticated
}) => {
  const { setPrefillEmail } = useAuthPopup();
  const { authState } = useFirebaseAuth();
  const prevAuthState = usePrevious(authState);

  useEffect(() => {
    if (authState !== prevAuthState && authState === AuthState.AUTHORIZED) {
      if (onAuthenticated) onAuthenticated();
    }
  }, [prevAuthState, authState, onAuthenticated]);

  useEffect(() => {
    if (prefillEmail !== undefined) setPrefillEmail(prefillEmail);
  }, [setPrefillEmail, prefillEmail]);

  return (
    <Modal open={open} onBackdropClick={() => onClose()}>
      <ModalPaper>
        <PopupContainer>
          <AuthPopup startScreen={startScreen} onClose={onClose} centered />
        </PopupContainer>
      </ModalPaper>
    </Modal>
  );
};

export default AuthModal;
