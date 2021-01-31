import TopBanner from 'components_2/banners/TopBanner';
import { useNotification } from 'hooks/useNotification';
import moment from 'moment';
import React from 'react';

const Notification = () => {
  const { id, message, setId, onClose } = useNotification();

  if (id == null) {
    return null;
  }

  if (id != null) {
    const localHide = localStorage.getItem(`hide_${id}`);

    if (localHide != null) {
      const localHideTime = parseInt(localHide, 10);
      const isHidingExpired = moment().diff(localHideTime, 'days') >= 7;

      if (isHidingExpired) {
        localStorage.removeItem(`hide_${id}`);
      } else {
        setId(undefined);
        return null;
      }
    }
  }

  return <TopBanner onClose={onClose}>{message}</TopBanner>;
};

export default Notification;
