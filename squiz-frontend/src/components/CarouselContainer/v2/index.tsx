import styled from '@emotion/styled';

/**
 * Carousel container for public website ( based on latest designs 2020 )
 * - can be used for Carousel sections.
 */
const CarouselContainer = styled.section`
  max-width: 1800px;
  margin: auto;
  width: 100%;
  padding-left: 64px;
  padding-right: 64px;
  @media (max-width: 1800px) {
    max-width: 1524px;
    padding-left: 64px;
    padding-right: 64px;
  }
  @media (max-width: 1681px) {
    max-width: 1476px;
    padding-left: 40px;
    padding-right: 40px;
  }
  @media (max-width: 600px) {
    padding-left: 13px;
    padding-right: 13px;
  }
  overflow: hidden;
`;

export default CarouselContainer;
