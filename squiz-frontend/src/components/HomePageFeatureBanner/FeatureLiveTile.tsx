import { t, Trans } from '@lingui/macro';
import LiveBadge from 'components/LiveBadge';
import TileButton from 'components/TileButton';
import VerticalSpacing from 'components/VerticalSpacing';
import { WEBAPP_HOST } from 'Config/constants';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import React from 'react';
import { Event } from 'services/events';
import {
  Attendees,
  FeatureTileButtonContent,
  JoinButton,
  TileInfo,
  TileTitle,
  TruncatedText
} from './styled';

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

const FeatureLiveTile: React.FC<Event & {
  paddingtop?: [string, string];
  disabled?: boolean;
}> = ({
  id,
  owner,
  _next_occurrences,
  event_curated_image_id,
  paddingtop,
  disabled,
  description,
  number_of_attendees
}) => {
  const TileTypes = {
    circleLive: 'circleLive',
    circleBeforeLive: 'circleBeforeLive'
  };

  const { start_date, has_ended } = _next_occurrences[0];
  const i18n = useLinguiI18n();

  let tileType = null;
  if (Date.now() > start_date.epoch && !has_ended) {
    tileType = TileTypes.circleLive;
  } else {
    tileType = TileTypes.circleBeforeLive;
  }

  const { bgImageMobile, bgImage } = getBgUrls(
    event_curated_image_id,
    owner.id
  );

  const userTimeZone =
    momentTimeZone.tz.guess() != null ? momentTimeZone.tz.guess() : '';
  const timeZoneMoment =
    momentTimeZone.tz.zone(userTimeZone) === null
      ? momentTimeZone.tz.zone('America/New_York')
      : momentTimeZone.tz.zone(userTimeZone);

  const getScheduledTime = () => {
    if (moment().isSame(moment(start_date.epoch), 'day'))
      return `${i18n._(t`Today`)} - ${moment(start_date.epoch)
        .local()
        .format('h:mm A')}`;

    return moment(start_date.epoch)
      .local()
      .format('ddd, DD MMM - h:mm A');
  };

  return (
    <TileButton
      disabled={disabled}
      bgImageMobile={bgImageMobile}
      bgImage={bgImage}
      paddingtop={paddingtop || ['130%', '178%']}
      to={`${WEBAPP_HOST}/live/${id}`}
      border="none"
    >
      <FeatureTileButtonContent isActive={tileType === TileTypes.circleLive}>
        {tileType === TileTypes.circleBeforeLive && (
          <>
            <LiveBadge />
            <VerticalSpacing height={9} />
            <TileTitle>{owner.name}</TileTitle>
            <VerticalSpacing height={9} />
            {start_date.epoch && (
              <TileInfo>{`${getScheduledTime()} 
        ${(momentTimeZone !== null &&
          timeZoneMoment !== null &&
          timeZoneMoment.abbr(start_date.epoch)) ||
          ''}`}</TileInfo>
            )}{' '}
          </>
        )}

        {tileType === TileTypes.circleLive && (
          <>
            <LiveBadge live className="absolute top-0 left-0" />
            <TileTitle>{owner.name}</TileTitle>
            {description && (
              <>
                <VerticalSpacing height={9} />

                <TileInfo>
                  <TruncatedText>{description}</TruncatedText>
                </TileInfo>
              </>
            )}
            <VerticalSpacing height={9} />

            <JoinButton>
              <Trans>Join</Trans>
            </JoinButton>

            <VerticalSpacing height={9} />

            {number_of_attendees && (
              <Attendees>
                <Trans>{number_of_attendees.toLocaleString()} attending</Trans>
              </Attendees>
            )}
          </>
        )}
      </FeatureTileButtonContent>
    </TileButton>
  );
};

export default FeatureLiveTile;
