import AddMetaDescription from 'components/AddMetaDescription';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { PageTypes } from 'lib/mparticle/enums';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';

interface Props {
  title: string;
  metaTitle: string;
  metaDescription: string;
  metaImage?: string;
  folderPath: string;
  slug: string;
}

const PageMeta = ({
  title,
  metaTitle,
  metaDescription,
  metaImage,
  folderPath,
  slug
}: Props) => {
  const { trackPageView } = usePageViewTracker();

  const i18n = useLinguiI18n();

  const pathUrl = `${folderPath}/${slug}`
    .split('/')
    .filter(x => x)
    .join('/');

  const fullUrl = `https://insighttimer.com/${pathUrl}`;

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.ContentfulPage,
      slug,
      page_language: i18n.language
    });
  }, [i18n.language, slug, trackPageView]);

  return (
    <AddMetaDescription>
      <title>{`${title} | Insight Timer`}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${metaTitle} | Insight Timer`} />
      <meta property="og:description" content={metaDescription} />
      <meta
        property="og:image"
        content={
          isEmpty(metaImage)
            ? 'https://insighttimer.com/static/media/logo-bowl.8c14da94.png'
            : metaImage
        }
      />
      <meta property="og:image:width" content="200" />
      <meta property="og:image:height" content="200" />
      <meta property="og:url" content={fullUrl} />

      <link rel="canonical" href={fullUrl} />
    </AddMetaDescription>
  );
};

export default PageMeta;
