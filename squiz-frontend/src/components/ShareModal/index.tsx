import Modal from '@material-ui/core/Modal';
import ShareMenu from 'components_2/base/ShareMenu';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useShareTrackingHandlers } from 'hooks/useShareTrackingHandlers';
import React, { useState } from 'react';
import { ModalPaper, PopupContainer } from './styled';

interface Props {
  open: boolean;
  url: string;
  message: string;
  onClose: () => void;
}

const ShareModal: React.FC<Props> = ({ open, url, message, onClose }) => {
  const [shareClicked, setShareClicked] = useState<boolean>(false);
  const { pageType } = usePageViewTracker();
  const { handleShareCancelled } = useShareTrackingHandlers(pageType);
  const handleBackdropClose = () => {
    onClose();
    if (!shareClicked) {
      handleShareCancelled();
    }
    setShareClicked(false);
  };

  return (
    <Modal open={open} onBackdropClick={handleBackdropClose}>
      <ModalPaper>
        <PopupContainer>
          <ShareMenu
            onShareSelect={() => setShareClicked(true)}
            onClose={onClose}
            showShare={open}
            shareMessage={message}
            url={url || ''}
            centered
          />
        </PopupContainer>
      </ModalPaper>
    </Modal>
  );
};

export default ShareModal;
