import styled from '@emotion/styled';

export const LibraryItemTileSize = styled.div`
  width: calc((100% - 10px) * 0.65) !important;
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
  @media (min-width: 1800px) {
    width: calc((100% - 120px) / 6) !important;
  }
`;

export const TeacherTileSize = styled.div`
  width: calc((100% - 10px - (100% - 10px) * 0.2) * 0.5) !important;
  @media (min-width: 600px) {
    width: calc((100% - 48px) / 3) !important;
  }
  @media (min-width: 960px) {
    width: calc((100% - 96px) / 5) !important;
  }
  @media (min-width: 1280px) {
    width: calc((100% - 120px) / 6) !important;
  }
  @media (min-width: 1800px) {
    width: calc((100% - 144px) / 7) !important;
  }
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const ReviewTileSize = styled.div`
  height: auto;
  width: 95% !important;
  @media (min-width: 600px) {
    width: calc((100% - 24px) / 2) !important;
  }
  @media (min-width: 960px) {
    width: calc((100% - 24px) / 2) !important;
  }
  @media (min-width: 1280px) {
    width: calc((100% - 48px) / 3) !important;
  }
  @media (min-width: 1680px) {
    width: calc((100% - 72px) / 4) !important;
  }
`;

export const GmReviewTileSize = styled.div`
  height: auto;
  width: 95% !important;
  @media (min-width: 600px) {
    width: calc((100% - 24px) / 2) !important;
  }
  @media (min-width: 960px) {
    width: calc((100% - 24px) / 2) !important;
  }
  @media (min-width: 1280px) {
    width: calc((100% - 24px) / 2) !important;
  }
  @media (min-width: 1680px) {
    width: calc((100% - 24px) / 2) !important;
  }
`;
