import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import LiveEventTile from 'components/LiveEventTile';
import { WEBAPP_HOST } from 'Config/constants';
import useLiveFeatured from 'hooks/useLiveFeatured';
import React, { useState } from 'react';
import { ReactComponent as CloseIcon } from './close-icon.svg';

export const CloseButton = styled(Button)`
  position: absolute;
  top: -13px;
  right: -10px;
  width: 25px;
  height: 25px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  border-radius: 100px;
  min-width: 0;
  padding: 0;
  z-index: 10000;
  outline: 0;
  :focus {
    outline: 0;
  }
`;

const LiveEventPaper = styled.div`
  width: 350px;
  z-index: 1400;
  position: fixed;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  box-shadow: 0 3px 12px -3px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  padding: 13px;
  margin-right: 28px;
  margin-bottom: 19px;
`;

const LiveEventAd: React.FC = () => {
  const currentLive = useLiveFeatured().getCurrentLive();
  const [hideAd, setHideAd] = useState<boolean>(false);
  return (
    <>
      {currentLive && !hideAd && (
        <LiveEventPaper>
          <CloseButton
            onClick={() => {
              setHideAd(true);
            }}
          >
            <CloseIcon />
          </CloseButton>
          <LiveEventTile
            id={currentLive.id}
            title={currentLive.title}
            publisherId={currentLive.owner.id}
            publisherName={currentLive.owner.name}
            publisherUsername={currentLive.owner.username}
            startAt={currentLive._next_occurrences[0].start_date.epoch}
            coverImageId={currentLive.event_curated_image_id}
            hasEnded={currentLive._next_occurrences[0].has_ended}
            numberOfAttendees={currentLive.number_of_attendees}
            webUrl={`${WEBAPP_HOST}/live/${currentLive.id}`}
            disableUp
            imagePaddingTop="67.7%"
          />
        </LiveEventPaper>
      )}
    </>
  );
};

export default LiveEventAd;
