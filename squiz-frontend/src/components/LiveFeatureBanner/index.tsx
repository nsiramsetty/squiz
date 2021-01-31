import styled from '@emotion/styled';
import LiveEventTile from 'components/LiveEventTile';
import TileCarousel from 'components/TileCarousel';
import { WEBAPP_HOST } from 'Config/constants';
import useLiveFeatured from 'hooks/useLiveFeatured';
import React from 'react';

interface Props {
  featured: string;
}

const SlideContainer = styled.div`
  height: 100%;
  width: calc((100% - 120px) / 6);

  @media (max-width: 1800px) {
    width: calc((100% - 96px) / 5);
    :last-child {
      display: none;
    }
  }

  @media (max-width: 1280px) {
    width: calc((100% - 72px) / 4);
  }

  @media (max-width: 992px) {
    width: calc((100% - 48px) / 3);
  }

  @media (max-width: 768px) {
    width: calc((100% - 24px) / 2);
  }

  @media (max-width: 600px) {
    width: 55%;
  }
`;

const LiveFeatureBanner: React.FC<Props> = ({ featured }) => {
  const live = useLiveFeatured(featured).getActiveLive();

  return (
    <TileCarousel>
      {() =>
        live.map(item => (
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
  );
};

export default LiveFeatureBanner;
