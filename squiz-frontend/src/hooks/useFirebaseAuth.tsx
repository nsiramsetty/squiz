import { User } from 'firebase';
import { firebaseAuth, getIdToken, sessionLogout } from 'lib/firebase/auth';
import { firestore } from 'lib/firebase/firestore';
import { logoutMParticle } from 'lib/mparticle/loggers';
import React, { useContext, useEffect, useMemo, useState } from 'react';

export enum AuthState {
  PENDING,
  UNAUTHORIZED,
  AUTHORIZED
}

export interface FirebaseUser {
  name?: string;
  email?: string;
  is_subscriber?: boolean;
}

export const AuthContext = React.createContext<{
  authState: AuthState;
  user?: firebase.User;
  userName?: string;
  userEmail?: string;
  isSubscriber?: boolean;
  logOut: () => Promise<void>;
}>({
  authState: AuthState.PENDING,
  logOut: () => Promise.resolve()
});

export const FirebaseAuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.PENDING);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser>();
  const [user, setUser] = useState<User | null>();
  const firebaseAuthMemo = useMemo(() => firebaseAuth, []);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        setAuthState(AuthState.AUTHORIZED);

        // Fetch user info
        firestore
          .doc(`users/${user.uid}/private/settings`)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              const data: any = doc.data();
              setFirebaseUser({
                name: data.name,
                email: data.email,
                is_subscriber: data.is_subscriber
              });
            }
          });

        // login mparticle
        window.mParticle!.Identity.login(
          {
            userIdentities: {
              customerid: user.uid,
              email: user.email
            }
          },
          (result: any) => {
            if (result.getUser()) {
              console.info(
                `mParticle.signin: ${JSON.stringify(result.getUser())}`
              );
            } else console.warn('mParticle.signin:fail');
          }
        );
      } else {
        setUser(undefined);
        setFirebaseUser(undefined);
        setAuthState(AuthState.UNAUTHORIZED);
      }
    });
  }, [firebaseAuthMemo]);

  async function logOut() {
    await getIdToken()
      .then(token => sessionLogout(token))
      .catch(err => console.warn(err));

    return firebaseAuth.signOut().then(() => {
      // send logout event to mparticle
      logoutMParticle();
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user: user || undefined,
        isSubscriber: firebaseUser && firebaseUser.is_subscriber,
        userName: firebaseUser && firebaseUser.name,
        userEmail: firebaseUser && firebaseUser.email,
        authState: authState,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useFirebaseAuth = () => useContext(AuthContext);
