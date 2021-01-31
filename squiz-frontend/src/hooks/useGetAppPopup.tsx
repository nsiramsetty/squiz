import GetAppModal from 'components/GetAppModal';
import React, { useCallback, useContext, useState } from 'react';

export const GetAppPopupContext = React.createContext<{
  showGetAppPopup: () => void;
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showGetAppPopup: () => {}
});

export const GetAppPopupProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  const showGetAppPopup = useCallback(() => setOpen(true), []);
  const hideGetAppPopup = useCallback(() => setOpen(false), []);

  return (
    <GetAppPopupContext.Provider
      value={{
        showGetAppPopup
      }}
    >
      <GetAppModal open={open} onClose={hideGetAppPopup} />
      {children}
    </GetAppPopupContext.Provider>
  );
};

export const useGetAppPopup = () => useContext(GetAppPopupContext);
