import { Plural, Trans } from '@lingui/macro';
import { numberConvert } from 'helpers/numerals';
import { useTaxonomy } from 'hooks/useTaxonomy';
import { LooseObject } from 'lib/models';
import { PageTypes } from 'lib/mparticle/enums';
import get from 'lodash/get';
import React from 'react';
import Item from './item';
import { StyledContentType, StyledDot } from './styled';

interface TProps {
  data: LooseObject;
  onClick: () => void;
  pageType?: PageTypes;
  searchQuery?: string;
}

const SearchItem: React.FC<TProps> = ({
  data,
  onClick,
  pageType,
  searchQuery
}) => {
  const { id } = data;
  let { title } = data;
  let url = get(data, 'web_url', '');
  let image;
  let description;
  let days;
  let gmParseObject;
  let courseParseObject;
  const taxonomy = useTaxonomy();

  switch (data.search_result_type) {
    case 'PEOPLE':
      image = get(data, 'avatar.small');
      title = data.name;
      description = (
        <Plural
          value={data.publisher_follower_count || 0}
          one={`${numberConvert(data.publisher_follower_count)} follower`}
          other={`${numberConvert(data.publisher_follower_count)} followers`}
        />
      );
      url = taxonomy.getTeacherUrl(data.username);
      break;

    case 'LIBRARY_ITEMS':
      image = get(data, 'picture_square.small');
      title = data.title;
      gmParseObject = {
        publisher: get(data, 'publisher.username'),
        slug: data.web_url.substring(data.web_url.lastIndexOf('/') + 1)
      };
      url = taxonomy.getSinglesUrl(gmParseObject.slug, gmParseObject.publisher);

      description = (
        <span>
          {data.publisher.name} <StyledDot />{' '}
          {data.content_type && (
            <>
              <StyledContentType>
                <Trans id={data.content_type.toLowerCase()} />
              </StyledContentType>{' '}
              <StyledDot />{' '}
            </>
          )}
          <Plural
            value={Math.floor(data.media_length / 60)}
            one="# min"
            other="# mins"
          />
        </span>
      );
      break;

    case 'COURSES':
      image = get(data, 'picture.small');
      days = data.days;
      courseParseObject = {
        slug: data.web_url.substring(data.web_url.lastIndexOf('/') + 1)
      };
      url = taxonomy.getCourseUrl(courseParseObject.slug);

      description = (
        <span>
          <Trans>
            {data.publisher.name} <StyledDot /> {data.days} DAY COURSE
          </Trans>
        </span>
      );
      break;

    case 'HASHTAGS':
      image = ``;
      title = data.name;
      description = <Trans>Topic</Trans>;
      url = `/meditation-topics/${data.topic}`;
      break;

    default:
      break;
  }

  return (
    <Item
      id={id}
      image={image}
      title={title}
      url={url}
      days={days}
      description={description}
      onClick={onClick}
      type={data.search_result_type}
      pageType={pageType}
      searchQuery={searchQuery}
    />
  );
};

export default SearchItem;
