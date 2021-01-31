import AuthModal from 'components/AuthModal';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthState, useFirebaseAuth } from './useFirebaseAuth';

export const AuthPopupContext = React.createContext<{
  showLoginPopup: () => void;
  showSignupPopup: (email?: string) => void;
  setPrefillEmail: (email: string) => void;
  prefillEmail?: string;
}>({
  showLoginPopup: () => {},
  showSignupPopup: email => {},
  setPrefillEmail: email => {}
});

export const AuthPopupProvider: React.FC = ({ children }) => {
  const [showAuthPopup, setShowAuthPopup] = useState<
    'login' | 'signup' | undefined
  >();
  const { authState } = useFirebaseAuth();
  const [prefillEmail, setPrefillEmail] = useState<string>();

  const displayLoginPopup = useCallback(() => {
    setShowAuthPopup('login');
  }, []);

  const displaySignupPopup = useCallback(email => {
    setShowAuthPopup('signup');
    email !== undefined && setPrefillEmail(email);
  }, []);

  const hideAuthPopup = useCallback(() => setShowAuthPopup(undefined), []);

  useEffect(() => {
    if (authState === AuthState.AUTHORIZED) {
      hideAuthPopup();
    }
  }, [authState, hideAuthPopup]);

  return (
    <AuthPopupContext.Provider
      value={{
        showLoginPopup: displayLoginPopup,
        showSignupPopup: displaySignupPopup,
        setPrefillEmail,
        prefillEmail
      }}
    >
      <AuthModal
        open={showAuthPopup ? true : false}
        startScreen={showAuthPopup}
        onClose={() => hideAuthPopup()}
      />
      {children}
    </AuthPopupContext.Provider>
  );
};

export const useAuthPopup = () => useContext(AuthPopupContext);
