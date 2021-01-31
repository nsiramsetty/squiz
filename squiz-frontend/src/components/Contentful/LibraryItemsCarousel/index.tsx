import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import styled from '@emotion/styled';
import Box from '@material-ui/core/Box';
import CarouselContainer from 'components/CarouselContainer/v2';
import CourseTile from 'components/CourseTile';
import LibraryItemTile from 'components/LibraryItemTile';
import TileCarousel from 'components/TileCarousel';
import VerticalSpacing from 'components/VerticalSpacing';
import { useFilteredCoursesQuery } from 'hooks/queries/useFilteredCoursesQuery';
import { useFilteredLibraryItemsQuery } from 'hooks/queries/useFilteredLibraryItemsQuery';
import { useTaxonomy } from 'hooks/useTaxonomy';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import React, { useEffect } from 'react';
import { Course } from 'services/courses';
import { LibraryItem } from 'services/singles';
import { RichTextWrapper } from '../TextSegment/styled';

export interface LibraryItemsCarouselProps {
  libraryItemIds: string[];
  introduction?: Document;
}

const LibraryItemTileSize = styled.div`
  width: calc((100% - 10px) * 0.49) !important;
  @media (min-width: 600px) {
    width: calc((100% - 24px) / 2) !important;
  }
  @media (min-width: 960px) {
    width: calc((100% - 48px) / 3) !important;
  }
  @media (min-width: 1280px) {
    width: calc((100% - 72px) / 4) !important;
  }
  @media (min-width: 1550px) {
    width: calc((100% - 96px) / 5) !important;
  }
`;

const LibraryItemsCarousel = ({
  libraryItemIds,
  introduction
}: LibraryItemsCarouselProps) => {
  const taxonomy = useTaxonomy();
  const { courses, loadData: loadCourses } = useFilteredCoursesQuery();
  const {
    libraryItems: singleTracks,
    loadData: LoadSingleTracks
  } = useFilteredLibraryItemsQuery();

  const courseIds = libraryItemIds.filter(id => id.includes('-'));
  const singleTrackIds = libraryItemIds.filter(id => !id.includes('-'));

  const data: (LibraryItem | Course)[] = singleTracks;
  const items = data.concat(courses);

  const sortedLibraryItems = sortBy(items, item => {
    return libraryItemIds.indexOf(item.id);
  });

  useEffect(() => {
    if (!isEmpty(singleTrackIds) && isEmpty(singleTracks)) {
      LoadSingleTracks({
        ids: singleTrackIds.join(','),
        content_types: ['guided', 'talks', 'music'],
        ignore_langs: true
      });
    }
  }, [singleTrackIds, LoadSingleTracks, singleTracks]);

  useEffect(() => {
    if (!isEmpty(courseIds) && isEmpty(courses)) {
      loadCourses({
        ids: courseIds.join(',')
      });
    }
  }, [courseIds, courses, loadCourses]);

  if (isEmpty(sortedLibraryItems)) return null;

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
          {inView =>
            sortedLibraryItems.map(item => (
              <LibraryItemTileSize key={item.id}>
                {item.item_type === 'SINGLE_TRACKS' && (
                  <LibraryItemTile
                    {...item}
                    to={taxonomy.getSinglesUrl(
                      item.slug,
                      item.publisher?.username
                    )}
                    teacherLink={taxonomy.getTeacherUrl(
                      item.publisher?.username
                    )}
                    lazyLoadInView={inView}
                  />
                )}
                {item.item_type === 'COURSES' && (
                  <CourseTile
                    {...item}
                    to={taxonomy.getCourseUrl(item.slug)}
                    teacherLink={taxonomy.getTeacherUrl(
                      item.publisher?.username
                    )}
                    lazyLoadInView={inView}
                  />
                )}
              </LibraryItemTileSize>
            ))
          }
        </TileCarousel>
      </Box>
    </CarouselContainer>
  );
};

export default LibraryItemsCarousel;
