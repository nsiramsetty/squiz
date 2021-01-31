import Axios from 'axios';
import FooterSpacing from 'components/FooterSpacing';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import * as contentful from 'contentful';
import { Entry } from 'contentful';
import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { ContentfulPage } from '.';
import LibraryItemsCarousel, {
  LibraryItemsCarouselProps
} from './LibraryItemsCarousel';
import LibraryItemsGrid, { LibraryItemsGridProps } from './LibraryItemsGrid';
import LiveEventsCarousel, {
  LiveEventsCarouselProps
} from './LiveEventsCarousel';
import PageMeta from './PageMeta';
import TextSegment, { TextSegmentProps } from './TextSegment';

const client = contentful.createClient({
  space: 'xrawk3nh4kj1',
  accessToken: 'yZN3kiRiHzz2uvwijh20vDjdlh9Vysibyxe30m2jKT4'
});

const SPACE_ID = 'xrawk3nh4kj1';
const PREVIEW_TOKEN = '0-4rLwIlETIq9j8ygVZNqwbSGDrZw9bNY_DTSplmz9w';

const RenderContent = ({ entryId }: { entryId: string }) => {
  const { data } = useSWR<Entry<unknown> | null>(
    `contentful/api/${entryId}`,
    () => {
      if (entryId) return client.getEntry(entryId).catch(() => null);
      return null;
    }
  );

  const contentModel = data?.sys?.contentType.sys.id;

  if (data == null) return null;

  switch (contentModel) {
    case 'textSegment':
      return <TextSegment {...(data.fields as TextSegmentProps)} />;
    case 'liveEventsCarousel':
      return (
        <LiveEventsCarousel {...(data.fields as LiveEventsCarouselProps)} />
      );
    case 'libraryItemsCarousel':
      return (
        <LibraryItemsCarousel {...(data.fields as LibraryItemsCarouselProps)} />
      );
    case 'libraryItemsGrid':
      return <LibraryItemsGrid {...(data.fields as LibraryItemsGridProps)} />;
    default:
      return null;
  }
};

const ContentfulPreview = () => {
  const { entryId } = useParams<{ entryId: string }>();

  const { data } = useSWR<Entry<unknown> | null>(
    `contentful/api/${entryId}`,
    () => {
      if (entryId) {
        return Axios.get(
          `https://preview.contentful.com/spaces/${SPACE_ID}/environments/master/entries/${entryId}?access_token=${PREVIEW_TOKEN}`
        ).then(res => res.data);
      }
      return null;
    }
  );

  if (data === undefined) return null; // FIXME: loading state

  if (data === null) {
    return <PageNotFound />;
  }

  const fields = data.fields as ContentfulPage;

  return (
    <>
      {fields != null && (
        <PageMeta
          title={fields.pageTitle}
          metaTitle={fields.metaTitle}
          metaDescription={fields.metaDescription}
          folderPath={fields.folderPath}
          slug={fields.slug}
        />
      )}

      {data.sys.contentType.sys.id === 'metaData' ? (
        fields.content?.map(content => {
          return (
            <RenderContent key={content.sys.id} entryId={content.sys.id} />
          );
        })
      ) : (
        <RenderContent key={data.sys.id} entryId={data.sys.id} />
      )}

      <FooterSpacing />

      <Footer />
    </>
  );
};

export default ContentfulPreview;
