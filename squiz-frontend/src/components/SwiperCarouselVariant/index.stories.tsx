import styled from '@emotion/styled';
import Container from '@material-ui/core/Container';
import ReviewTile from 'components/ReviewTile';
import React from 'react';
import 'swiper/css/swiper.css';
import '../../styles/typography.scss';
import SwiperCarouselVariant from './index';

const data = new Array(5).fill(1);

export default { title: 'SwiperCarouselVariant' };

export const withImageSlides = () => (
  <Container>
    <div style={{ paddingTop: '100px' }} />
    <SwiperCarouselVariant>
      {data.map((v, i) => (
        <SlideContainer key={i}>
          <ReviewTile
            owner={{
              id: '123',
              name: 'xyz'
            }}
            message="Testing 123"
            rated_at={{
              epoch: 1598424141
            }}
          />
        </SlideContainer>
      ))}
    </SwiperCarouselVariant>
  </Container>
);

export const withText = () => (
  <Container>
    <SwiperCarouselVariant>
      {data.map((v, i) => (
        <SlideContainer key={i}>
          <AspectRatioSlide className="tile_background_image" />
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </SlideContainer>
      ))}
    </SwiperCarouselVariant>
  </Container>
);
/**
 * Sample Tile Container
 * - sets width of each tile, to control how many to be shown in a row
 *
 * Calculations
 * - when displaying 4 tiles, each tile width = ( 100% - 3 * spacings ) / 4 tiles
 */
const SlideContainer = styled.div`
  height: 100%;
  width: calc((100% - 150px) / 4) !important;
  @media (max-width: 1600px) {
    width: calc((100% - 100px) / 3) !important;
  }
  @media (max-width: 1200px) {
    width: calc((100% - 50px) / 2) !important;
  }
  @media (max-width: 600px) {
    width: 100% !important;
  }
`;

/**
 * Sample Tile with aspect ratio
 */
const AspectRatioSlide = styled.div`
  width: 100%;
  padding-top: 80%;
  border-radius: 16px;
  background-color: lightgrey;
`;
