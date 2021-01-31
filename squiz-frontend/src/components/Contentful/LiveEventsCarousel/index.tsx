import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import Box from '@material-ui/core/Box';
import CarouselContainer from 'components/CarouselContainer/v2';
import LiveEventTile from 'components/LiveEventTile';
import TileCarousel from 'components/TileCarousel';
import VerticalSpacing from 'components/VerticalSpacing';
import { WEBAPP_HOST } from 'Config/constants';
import useFilteredEventsQuery from 'hooks/queries/useFilteredEventsQuery';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';
import { RichTextWrapper } from '../TextSegment/styled';
import SlideContainer from './styled';

export interface LiveEventsCarouselProps {
  filters: string[];
  introduction?: Document;
}

const LiveEventsCarousel = ({
  filters,
  introduction
}: LiveEventsCarouselProps) => {
  const { events, loadData } = useFilteredEventsQuery();

  useEffect(() => {
    loadData({ hashtags: filters.join(',') }, 0, 20);
  }, [filters, loadData]);

  if (isEmpty(events)) return null;

  return (
    <CarouselContainer>
      <VerticalSpacing height={[50, 100]} />

      <Box maxWidth="1496px" margin="auto">
        {introduction != null && (
          <>
            <RichTextWrapper>
              {documentToReactComponents(introduction)}
            </RichTextWrapper>
            <VerticalSpacing height={[10, 16]} />
          </>
        )}

        <TileCarousel>
          {() =>
            events.map(item => (
              <SlideContainer key={item.id}>
                <LiveEventTile
                  id={item.id}
                  title={item.title}
                  publisherId={item.owner.id}
                  publisherName={item.owner.name}
                  publisherUsername={item.owner.username}
                  startAt={item._next_occurrences[0].start_date.epoch}
                  coverImageId={item.event_curated_image_id}
                  hasEnded={item._next_occurrences[0].has_ended}
                  numberOfAttendees={item.number_of_attendees}
                  webUrl={`${WEBAPP_HOST}/live/${item.id}`}
                  hideAttendButton
                />
              </SlideContainer>
            ))
          }
        </TileCarousel>
      </Box>
    </CarouselContainer>
  );
};

export default LiveEventsCarousel;
