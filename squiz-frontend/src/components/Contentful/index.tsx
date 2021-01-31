import Axios from 'axios';
import FooterSpacing from 'components/FooterSpacing';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import { Asset, Entry } from 'contentful';
import React, { ReactElement } from 'react';
import useSWR from 'swr';
import LibraryItemsCarousel, {
  LibraryItemsCarouselProps
} from './LibraryItemsCarousel';
import LibraryItemsGrid, { LibraryItemsGridProps } from './LibraryItemsGrid';
import LiveEventsCarousel, {
  LiveEventsCarouselProps
} from './LiveEventsCarousel';
import PageMeta from './PageMeta';
import TextSegment, { TextSegmentProps } from './TextSegment';

interface Props {
  jsonFileName: string;
  fallback?: ReactElement;
}

export type ContentfulPage = {
  folderPath: string;
  slug: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  metaImage?: Asset;
  content: Entry<unknown>[];
};

const Contentful = ({ jsonFileName, fallback }: Props) => {
  const { data } = useSWR<ContentfulPage | null>(
    `contentful/${jsonFileName}`,
    path =>
      Axios.get<Entry<unknown> | null>(
        `${process.env.REACT_APP_SITEMAP_HOST}/${path}.json`
      )
        .then(resp => resp.data?.fields as ContentfulPage)
        .catch(() => null)
  );

  if (data === undefined) return null; // FIXME: loading state

  if (data === null) {
    if (fallback) return fallback;

    return <PageNotFound />;
  }

  const contents: Entry<unknown>[] = data?.content || [];

  return (
    <>
      {data != null && (
        <PageMeta
          title={data.pageTitle}
          metaTitle={data.metaTitle}
          metaDescription={data.metaDescription}
          metaImage={`https:${data.metaImage?.fields.file.url}`}
          folderPath={data.folderPath}
          slug={data.slug}
        />
      )}

      {contents.map(content => {
        const contentModel = content.sys?.contentType?.sys?.id;
        switch (contentModel) {
          case 'textSegment':
            return (
              <TextSegment
                {...(content.fields as TextSegmentProps)}
                key={content.sys.id}
              />
            );
          case 'liveEventsCarousel':
            return (
              <LiveEventsCarousel
                {...(content.fields as LiveEventsCarouselProps)}
                key={content.sys.id}
              />
            );
          case 'libraryItemsCarousel':
            return (
              <LibraryItemsCarousel
                {...(content.fields as LibraryItemsCarouselProps)}
                key={content.sys.id}
              />
            );
          case 'libraryItemsGrid':
            return (
              <LibraryItemsGrid
                {...(content.fields as LibraryItemsGridProps)}
                key={content.sys.id}
              />
            );
          default:
            return null;
        }
      })}

      <FooterSpacing />

      <Footer />
    </>
  );
};

export default Contentful;
