import AddMetaDescription from 'components/AddMetaDescription';
import { usePageViewTracker } from 'context/PageViewTracker';
import React from 'react';

const PageMeta = ({
  url,
  title,
  description,
  ogImageUrl,
  pageUrl
}: {
  url: string;
  title: string;
  description: string;
  ogImageUrl?: string;
  pageUrl?: string;
}) => {
  const { deepLink } = usePageViewTracker();

  return (
    <AddMetaDescription>
      <title>{title}</title>
      <meta name="description" content={`${description}`} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={`${description}`} />
      <meta
        property="og:image"
        content={
          ogImageUrl ||
          'https://insighttimer.com/static/media/logo-bowl.8c14da94.png'
        }
      />
      <meta property="og:image:width" content="200" />
      <meta property="og:image:height" content="200" />
      <meta property="og:url" content={pageUrl || url} />
      <link rel="canonical" href={url} />
      {deepLink != null && (
        <meta name="branch:deeplink:$deeplink" content={deepLink} />
      )}

      {deepLink != null && (
        <meta name="branch:deeplink:$deeplink_v2" content={deepLink} />
      )}
    </AddMetaDescription>
  );
};

export default PageMeta;
