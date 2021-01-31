import { ClickedEventNames, PageTypes } from 'lib/mparticle/enums';
import { logClicked } from 'lib/mparticle/loggers';

export function useShareTrackingHandlers(pageType: PageTypes) {
  const handleShareChannel = (buttonText?: any) => {
    logClicked(ClickedEventNames.ShareInitiated, pageType, buttonText);
  };

  const handleShareCancelled = (buttonText?: any) => {
    logClicked(ClickedEventNames.ShareCancelledByUser, pageType, buttonText);
  };

  const handleShareChannelSelected = (e: any) => {
    logClicked(
      ClickedEventNames.ShareChannelSelected,
      pageType,
      e.target.innerText
    );
  };

  return {
    handleShareChannel,
    handleShareCancelled,
    handleShareChannelSelected
  };
}
