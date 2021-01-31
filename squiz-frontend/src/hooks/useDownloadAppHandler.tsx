import * as branch from 'api/branch';
import { usePageViewTracker } from 'context/PageViewTracker';
import { getMobileOperatingSystem } from 'helpers/utils';
import { logAppDownloadClicked } from 'lib/mparticle/loggers';

const useDownloadAppHandler = () => {
  const platform = getMobileOperatingSystem();
  const { pageType, deepLink } = usePageViewTracker();

  function downloadAppCallback(e: any) {
    const target = e.target as HTMLElement;

    pageType && logAppDownloadClicked(platform, pageType, target.innerText);

    let query = branch.analyticsQuery(pageType);
    deepLink && (query += `&$deeplink_v2=${deepLink}&$deeplink=${deepLink}`);
    window.location.href = `https://insig.ht/appDownload${
      query ? `?${query}` : ''
    }`;
  }

  return downloadAppCallback;
};

export default useDownloadAppHandler;
