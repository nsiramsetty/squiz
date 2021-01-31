import {
  ClickFields,
  PageFields,
  PageTypes,
  SearchEventNames,
  SearchFields,
  SlugFields
} from 'lib/mparticle/enums';
import { logSearchEvent } from 'lib/mparticle/loggers';
import React, { ReactElement } from 'react';
import {
  StyledAvatar,
  StyledDescription,
  StyledLeft,
  StyledLink,
  StyledRight,
  StyledTitle
} from './styled';

interface TProps {
  image: string;
  title: string;
  url: string;
  id: string;
  type: string;
  days?: number;
  description?: string | ReactElement;
  pageType?: PageTypes;
  searchQuery?: string;
  onClick: () => void;
}

const Item: React.FC<TProps> = ({
  id,
  url,
  image,
  type,
  days,
  title,
  description,
  pageType,
  searchQuery,
  onClick
}) => {
  const trackingData = {
    [PageFields.PageType]: pageType || PageTypes.Unknown,
    [SearchFields.SearchTerm]: searchQuery,
    [SearchFields.SearchResultType]: type,
    [ClickFields.DestinationPath]: url,
    ...(type === 'PEOPLE' && {
      [SlugFields.PublisherId]: id,
      [SlugFields.PublisherName]: title
    }),
    ...(type === 'LIBRARY_ITEMS' && {
      [SlugFields.MediaItemId]: id,
      [SlugFields.MediaItemName]: title
    }),
    ...(type === 'COURSES' && {
      [SlugFields.CourseId]: id,
      [SlugFields.CourseName]: title,
      [SlugFields.CourseLength]: days
    })
  };

  return (
    <StyledLink
      to={url}
      onClick={() => {
        onClick();
        logSearchEvent(SearchEventNames.SearchListingClicked, trackingData);
      }}
    >
      <StyledLeft>
        <StyledAvatar
          image={type !== 'HASHTAGS' ? image : undefined}
          fullrounded={type === 'PEOPLE' ? 1 : 0}
        />
      </StyledLeft>

      <StyledRight>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </StyledRight>
    </StyledLink>
  );
};

export default Item;
