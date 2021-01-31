import styled from '@emotion/styled';

export const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -5px;

  @media (min-width: 600px) {
    margin: 0 -12px;
  }
`;

export const LibraryItemGridSize = styled.div`
  width: calc(100% / 6);
  padding: 0 12px;

  @media (max-width: 1800px) {
    width: calc(100% / 5);
  }

  @media (max-width: 1280px) {
    width: calc(100% / 4);
  }

  @media (max-width: 992px) {
    width: calc(100% / 3);
  }

  @media (max-width: 768px) {
    width: calc(100% / 2);
    padding: 0 5px;
  }
`;
