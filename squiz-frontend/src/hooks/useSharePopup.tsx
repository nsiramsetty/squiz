import ShareModal from 'components/ShareModal';
import React, { useCallback, useContext, useState } from 'react';

export const SharePopupContext = React.createContext<{
  showSharePopup: (shareUrl: string, shareMessage: string) => void;
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showSharePopup: () => {}
});

export const SharePopupProvider: React.FC = ({ children }) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [message, setMesssage] = useState<string>('');

  const onShare = useCallback((shareUrl, shareMessage) => {
    window.zE && window.zE.hide && window.zE.hide();
    setShowShareModal(true);
    setUrl(shareUrl);
    setMesssage(shareMessage);
  }, []);

  const handleShareClose = () => {
    setShowShareModal(false);    
    window.zE && window.zE.show && window.zE.show();
  }
  const hideSharePopup = useCallback(() => handleShareClose(), []);

  return (
    <SharePopupContext.Provider
      value={{
        showSharePopup: onShare
      }}
    >
      <ShareModal
        open={showShareModal}
        onClose={hideSharePopup}
        message={message}
        url={url}
      />
      {children}
    </SharePopupContext.Provider>
  );
};

export const useSharePopup = () => useContext(SharePopupContext);
