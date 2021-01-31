import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import LibraryItemTile from 'components/LibraryItemTile';
import SectionContainer from 'components/SectionContainer/v2';
import { GridContainer } from 'components/TileGridSize';
import VerticalSpacing from 'components/VerticalSpacing';
import { useSearchQuery } from 'hooks/queries/useSearchQuery';
import { useTaxonomy } from 'hooks/useTaxonomy';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import React, { useEffect, useState } from 'react';
import { LibraryItem } from 'services/singles';
import { RichTextWrapper } from '../TextSegment/styled';

export interface LibraryItemsGridProps {
  introduction?: Document;
  searchTerms: string[];
}

const LibraryItemGridSize = styled.div`
  width: calc(100% / 5);
  padding: 0 12px;

  @media (max-width: 1550px) {
    width: calc(100% / 4);
  }

  @media (max-width: 1280px) {
    width: calc(100% / 3);
  }

  @media (max-width: 960px) {
    width: calc(100% / 2);
    padding: 0 5px;
  }
`;

const LibraryItemsGrid = ({
  searchTerms,
  introduction
}: LibraryItemsGridProps) => {
  const taxonomy = useTaxonomy();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const { loadSingleTrackData } = useSearchQuery();

  useEffect(() => {
    searchTerms.forEach(term => {
      loadSingleTrackData(term, 16).then(resp => {
        setItems(currentItems => currentItems.concat(resp));
      });
    });
  }, [loadSingleTrackData, searchTerms]);

  const libraryItems = uniqBy(items, item => item.id);

  if (isEmpty(libraryItems)) return null;

  return (
    <SectionContainer>
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

        {libraryItems != null && (
          <GridContainer>
            {libraryItems.map(item => (
              <LibraryItemGridSize key={item.id}>
                <LibraryItemTile
                  {...item}
                  to={taxonomy.getSinglesUrl(
                    item.slug,
                    item.publisher?.username
                  )}
                  teacherLink={taxonomy.getTeacherUrl(item.publisher?.username)}
                  lazyLoadInView
                />
                <VerticalSpacing height={40} />
              </LibraryItemGridSize>
            ))}
          </GridContainer>
        )}
      </Box>
    </SectionContainer>
  );
};

export default LibraryItemsGrid;
