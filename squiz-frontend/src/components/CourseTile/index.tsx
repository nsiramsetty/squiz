import { Trans } from '@lingui/macro';
import VerticalSpacing from 'components/VerticalSpacing';
import noop from 'lodash/noop';
import React from 'react';
import { Link } from 'react-router-dom';
import { UserSummary } from 'services/courses';
import { getLibraryItemImageUrl } from 'services/media';
import {
  StyledAttributes,
  StyledDays,
  StyledImage,
  StyledMemberplusIcon,
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

type TProps = {
  to: string;
  teacherLink: string;
  id?: string;
  title?: string;
  days?: number;
  rating_score?: number;
  rating_count?: number;
  publisher?: UserSummary;
  lazyLoadInView: boolean;
  textColor?: string;
  purchase_tier?: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
};

const LibraryItemTile: React.FC<TProps> = ({
  to,
  teacherLink,
  id,
  title,
  days,
  publisher,
  rating_score,
  rating_count,
  lazyLoadInView,
  textColor,
  purchase_tier,
  onClick
}) => {
  const imageUrl = id && getLibraryItemImageUrl(id, 'square', 'medium');

  return (
    <>
      <div className="tile_background_image">
        <StyledTileButton component={Link} to={to} onClick={onClick || noop}>
          <TileItemContainer className="image-container">
            {lazyLoadInView && (
              <StyledImage src={imageUrl} alt="library item cover" />
            )}
            <StyledOverlay load={lazyLoadInView} />

            <StyledAttributes>
              <StyledDays>
                <Trans>{days}-day course</Trans>
              </StyledDays>
              {purchase_tier !== 'INSIGHT_FREE_COURSE' && (
                <StyledMemberplusIcon />
              )}
            </StyledAttributes>
          </TileItemContainer>
        </StyledTileButton>
      </div>

      <VerticalSpacing height={8} />

      <StyledText>
        <StyledTeacherButton
          component={Link}
          to={teacherLink}
          color={textColor}
        >
          {publisher?.name}
        </StyledTeacherButton>

        <VerticalSpacing height={5} />

        <StyledTitle
          component={Link}
          to={to}
          onClick={onClick}
          color={textColor}
        >
          {title}
        </StyledTitle>

        <VerticalSpacing height={7} />

        {rating_score != null ? (
          <StyledRating>
            <StyledStarIcon color={textColor} />

            <StyledRatingScore color={textColor}>
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
