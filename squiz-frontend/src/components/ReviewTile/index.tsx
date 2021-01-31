import StarRating from 'components/StarRating';
import TruncateText from 'components_2/base/TruncateText';
import React, { SFC } from 'react';
import { DateTime, UserSummary } from 'services/courses';
import {
  ReviewAuthorAvatar,
  ReviewAuthorName,
  ReviewContainer,
  ReviewDate,
  ReviewHeader,
  ReviewHeaderMiddle,
  ReviewMessage
} from './styled';

// Props for functional component
interface TProps {
  owner: UserSummary;
  message?: string;
  rating?: number;
  rated_at?: DateTime;
  created_at?: DateTime;
}

const ReviewTile: SFC<TProps> = ({
  owner,
  message,
  rating,
  rated_at,
  created_at
}) => {
  const avatar = `https://users.insighttimer-api.net/${owner.id}%2Fpictures%2Fsquare_small.jpeg?alt=media`;

  return (
    <ReviewContainer>
      <ReviewHeader>
        <ReviewAuthorAvatar src={avatar} />
        <ReviewHeaderMiddle>
          <ReviewAuthorName>{owner.name?.split(' ')[0]}</ReviewAuthorName>
          <ReviewDate>
            {new Date(rated_at?.epoch || created_at?.epoch || 0).toLocaleString(
              undefined,
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }
            )}
          </ReviewDate>
        </ReviewHeaderMiddle>
        <StarRating rating={rating || 0} starHeight={12} />
      </ReviewHeader>

      <ReviewMessage>
        <TruncateText text={message} maxChars={350} wordsDelta={5} />
      </ReviewMessage>
    </ReviewContainer>
  );
};

export default ReviewTile;
