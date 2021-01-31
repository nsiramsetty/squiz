import VerticalSpacing from 'components/VerticalSpacing';
import noop from 'lodash/noop';
import React from 'react';
import { Link } from 'react-router-dom';
import { UserSummary } from 'services/courses';
import {
  StyledDuration,
  StyledImage,
  StyledMusicIcon,
  StyledOverlay,
  StyledRating,
  StyledRatingCount,
  StyledRatingScore,
  StyledStarIcon,
  StyledTeacherButton,
  StyledText,
  StyledTileButton,
  StyledTitle,
  TileItemContainer
} from './styles';

export type TProps = {
  to: string;
  teacherLink: string;
  id?: string;
  title?: string;
  media_length?: number;
  rating_score?: number;
  rating_count?: number;
  content_type?: 'MUSIC' | 'GUIDED' | 'TALK';
  publisher?: UserSummary;
  lazyLoadInView: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
};

const LibraryItemTile: React.FC<TProps> = ({
  to,
  teacherLink,
  id,
  title,
  publisher,
  media_length,
  rating_score,
  rating_count,
  content_type,
  lazyLoadInView,
  onClick
}) => {
  const imageUrl = `${process.env.REACT_APP_LIBRARY_ITEM_IMAGE}/${id}%2Fpictures%2Ftiny_square_medium.jpeg?alt=media`;

  const getDurationInMinutes = (lengthSec: number) => {
    if (lengthSec) {
      if (lengthSec > 59) return `${Math.floor(lengthSec / 60)} min`;
      return `${lengthSec} sec`;
    }
    return '';
  };

  return (
    <>
      <div className="tile_background_image">
        <StyledTileButton
          component={Link}
          to={to}
          onClick={onClick || noop}
          className="tile_background_image"
        >
          <TileItemContainer className="image-container">
            {lazyLoadInView && (
              <StyledImage src={imageUrl} alt="library item cover" />
            )}
            <StyledOverlay load={lazyLoadInView} />

            <StyledDuration>
              {getDurationInMinutes(media_length || 0)}

              {content_type === 'MUSIC' && <StyledMusicIcon />}
            </StyledDuration>
          </TileItemContainer>
        </StyledTileButton>
      </div>

      <VerticalSpacing height={8} />

      <StyledText>
        <StyledTeacherButton component={Link} to={teacherLink}>
          {publisher?.name}
        </StyledTeacherButton>

        <VerticalSpacing height={5} />

        <StyledTitle component={Link} to={to} onClick={onClick}>
          {title}
        </StyledTitle>

        <VerticalSpacing height={7} />

        {rating_score != null ? (
          <StyledRating>
            <StyledStarIcon />

            <StyledRatingScore>
              {Math.round(rating_score * 10) / 10}
            </StyledRatingScore>

            {rating_count != null && (
              <StyledRatingCount>
                ({rating_count.toLocaleString()})
              </StyledRatingCount>
            )}
          </StyledRating>
        ) : null}
      </StyledText>
    </>
  );
};

export default LibraryItemTile;
