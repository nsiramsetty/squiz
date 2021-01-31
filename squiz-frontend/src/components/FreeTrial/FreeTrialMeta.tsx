import AddMetaDescription from 'components/AddMetaDescription';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { PageTypes } from 'lib/mparticle/enums';
import React, { useEffect } from 'react';

interface TProps {
  title?: string;
  description?: string;
}

const FreeTrialMeta: React.FC<TProps> = ({ title, description }) => {
  const { trackPageView } = usePageViewTracker();

  const i18n = useLinguiI18n();
  const url = 'https://insighttimer.com/subscribe/free-trial';

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.FreeTrialPage,
      page_language: i18n.language
    });
  }, [trackPageView, i18n.language]);

  if (title != null && description != null) {
    return (
      <>
        <AddMetaDescription>
          <title>{`${title} | Insight Timer`} </title>
          <meta name="description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={`${title} | Insight Timer`} />
          <meta property="og:description" content={description} />
          <meta
            property="og:image"
            content="https://insighttimer.com/static/media/logo-bowl.8c14da94.png"
          />
          <meta property="og:image:width" content="200" />
          <meta property="og:image:height" content="200" />
          <meta property="og:url" content={url} />

          <link rel="canonical" href={url} />
        </AddMetaDescription>
      </>
    );
  }

  return null;
};

export default FreeTrialMeta;
