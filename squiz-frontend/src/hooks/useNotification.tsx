import noop from 'lodash/noop';
import moment from 'moment';
import React, { ReactNode, useCallback, useContext, useState } from 'react';

export const NotificationContext = React.createContext<{
  id?: string;
  message?: string | ReactNode;
  setId: (id?: string) => void;
  setMessage: (message: string | ReactNode) => void;
  onClose: () => void;
}>({
  setId: noop,
  setMessage: noop,
  onClose: noop
});

export const NotificationProvider: React.FC = ({ children }) => {
  const [id, setId] = useState<string | undefined>();
  const [message, setMessage] = useState<string | ReactNode | undefined>();

  const handleId = useCallback(notifId => setId(notifId), []);
  const handleMessage = useCallback(
    NotifMessage => setMessage(NotifMessage),
    []
  );
  const handleClose = () => {
    if (id) {
      const timeStampString = moment()
        .valueOf()
        .toString();

      localStorage.setItem(`hide_${id}`, timeStampString);
      setId(undefined);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        id,
        message,
        setId: handleId,
        setMessage: handleMessage,
        onClose: handleClose
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
