const firebase = jest.genMockFromModule('firebase/app');

export const auth = jest.fn();
export const firestore = jest.fn();
export const onAuthStateChanged = jest.fn();
export const apps = {}
export const initializeApp = jest.fn(() => {
  return {
    auth,
    firestore
  };
});

export default firebase;
