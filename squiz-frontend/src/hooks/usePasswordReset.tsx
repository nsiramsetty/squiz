import firebase from 'lib/firebase';
import { useEffect, useState } from 'react';
const firebaseAuth = firebase.auth();

export function usePasswordReset(mode: any, oobCode: any) {
  const [success, setSuccess] = useState<boolean>();
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>();
  const [email, setEmail] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [passwordMessage, setPasswordMessage] = useState<string>();

  const handleResetPassword = () => {
    if (oobCode) {
      firebaseAuth
        .verifyPasswordResetCode(oobCode)
        .then(function(email) {
          setEmail(email);
          setSuccess(true);
        })
        .catch(function(error) {
          setErrorMessage(error.message);
          setSuccess(false);
        });
    } else {
      setSuccess(false);
      setErrorMessage('Reset password code is invalid.');
    }
  };

  const changePassword = (newPassword: string) => {
    setPasswordMessage('');
    firebaseAuth
      .confirmPasswordReset(oobCode, newPassword)
      .then(function(resp) {
        setPasswordSuccess(true);
        setPasswordMessage('You can now sign in with your new password');
      })
      .catch(function(error) {
        setPasswordMessage(error.message);
        setPasswordSuccess(false);
      });
  };

  useEffect(() => {
    switch (mode) {
      case 'resetPassword':
        handleResetPassword();
        break;
      case 'recoverEmail':
        break;
      case 'verifyEmail':
        break;
      default:
        setSuccess(false);
        setErrorMessage('Reset password mode is invalid.');
    }
    // eslint-disable-next-line
  }, []);

  return {
    email,
    errorMessage,
    success,
    passwordSuccess,
    passwordMessage,
    changePassword
  };
}
