import VerticalSpacing from 'components/VerticalSpacing';
import { WEBAPP_HOST } from 'Config/constants';
import { FeaturedLive } from 'lib/featured';
import numeral from 'numeral';
import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayTime, isLiveNow } from 'services/events/helpers';
import {
  Attendees,
  AttendeesContainer,
  EventOwner,
  EventTitle,
  JoinButton,
  Left,
  Right,
  ScheduledTime,
  StyledImage,
  StyledOverlay,
  TileItemContainer
} from './styled';
import StyledTileButton from './StyledTileButton';

type TProps = FeaturedLive & {
  disabled?: boolean;
  imagePaddingTop?: string;
  disableUp?: boolean;
  hideAttendButton?: boolean;
};

const getBgUrls = (coverImageId?: string, publisherId?: string) => {
  if (coverImageId) {
    return {
      bgImageMobile: `https://circles.insighttimer-api.net/${coverImageId}%2Fpictures%2Fsquare_medium.jpeg?alt=media`,
      bgImage: `https://circles.insighttimer-api.net/${coverImageId}%2Fpictures%2Fsquare_large.jpeg?alt=media`
    };
  }
  return {
    bgImageMobile: `https://users.insighttimer-api.net/${publisherId}%2Fpictures%2Fsquare_medium.jpeg?alt=media`,
    bgImage: `https://users.insighttimer-api.net/${publisherId}%2Fpictures%2Fsquare_large.jpeg?alt=media`
  };
};

const LiveEventTile: React.FC<TProps> = ({
  id,
  coverImageId,
  publisherName,
  publisherUsername,
  publisherId,
  startAt,
  title,
  numberOfAttendees,
  hasEnded,
  imagePaddingTop,
  webUrl,
  hideAttendButton
}) => {
  const { bgImageMobile } = getBgUrls(coverImageId, publisherId);

  return (
    <>
      <div className="tile_background_image">
        <StyledTileButton href={`${WEBAPP_HOST}/live/${id}`}>
          <TileItemContainer
            className="image-container"
            paddingTop={imagePaddingTop || '130.7%'}
          >
            <StyledImage src={bgImageMobile} alt="library item cover" />

            <StyledOverlay />

            {startAt > 0 && (
              <ScheduledTime live={isLiveNow(startAt, hasEnded)}>
                {getDisplayTime(startAt, hasEnded)}
              </ScheduledTime>
            )}
          </TileItemContainer>
        </StyledTileButton>
      </div>

      <VerticalSpacing height={9} />

      {publisherUsername ? (
        <Link to={`/${publisherUsername}`}>
          <EventOwner>{publisherName}</EventOwner>
        </Link>
      ) : (
        <EventOwner>{publisherName}</EventOwner>
      )}

      <VerticalSpacing height={5} />

      <a href={webUrl || `${WEBAPP_HOST}/live/${id}`}>
        <EventTitle>{title}</EventTitle>

        <VerticalSpacing height={3} />
        <AttendeesContainer>
          <Left>
            {numberOfAttendees && (
              <Attendees>
                {`${
                  numberOfAttendees > 999
                    ? numeral(numberOfAttendees).format('0.0a')
                    : numberOfAttendees
                } attending`}
              </Attendees>
            )}
          </Left>

          {!hideAttendButton && (
            <Right>
              <JoinButton
                bgcolor={isLiveNow(startAt, hasEnded) ? '#b90c4e' : '#222222'}
                textcolor={isLiveNow(startAt, hasEnded) ? '#fff' : '#ffff'}
              >
                {isLiveNow(startAt, hasEnded) ? 'Enter' : 'Attend'}
              </JoinButton>
            </Right>
          )}
        </AttendeesContainer>
      </a>
    </>
  );
};

export default LiveEventTile;
