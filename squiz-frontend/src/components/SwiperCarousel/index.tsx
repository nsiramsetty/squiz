/**
 * This Carousel has default settings :
 * - spacing between tiles - 20px for mobile and 50px otherwise
 * - TODO: configurable spacing - by passing in swiper props
 *
 * To control number of slide show in a row, we control the width of each slide seperately :
 *
 * ```width: calc((100% - total_spacing)/number_tiles)px```
 *
 * eg. if we want to show 4 tiles, and there is 3 spacings of 50px between tiles in a row
 *
 * ```calc( (100% - (3*50px)) / 4 )px```
 *
 * Notes: after configuring the width of each slide, we usually use slide content that has 100% width
 * and top-padding to set aspect-ratio so the height is determined by the content itself
 *
 * See index.stories.js for example
 */

import styled from '@emotion/styled';
import get from 'lodash/get';
import React, { useLayoutEffect, useRef, useState } from 'react';
import 'swiper/css/swiper.css';
import SwiperStyled from './SwiperStyled';

interface Props {
  anchorClass?: string;
  spaceBetween?: [number, number, number, number];
  overflow?: string;
}

const Container = styled.div<{ overflow?: string }>`
  position: relative;
  .swiper-container {
    position: unset;
    overflow: ${props => props.overflow || 'hidden'};
    @media (max-width: 600px) {
      overflow: visible;
    }
  }
  .swiper-button-next:after,
  .swiper-button-prev:after,
  .swiper-button-prev.swiper-button-disabled,
  .swiper-button-next.swiper-button-disabled {
    display: none;
  }
`;

const SwiperCarousel: React.FC<Props> = ({
  children,
  anchorClass,
  spaceBetween,
  overflow
}) => {
  const slideImgRef = useRef<HTMLDivElement>(null);
  const [slideImageHeight, setSlideImageHeight] = useState<number>();

  // get height of image to center next/prev buttons
  useLayoutEffect(() => {
    const getSlideImgHeight = () => {
      const slideImg = slideImgRef.current;
      if (slideImg) {
        const slideImageDOM = slideImg.querySelector(`.${anchorClass}`);
        const height = get(slideImageDOM, 'clientHeight', 0);
        setSlideImageHeight(height);
      }
    };

    getSlideImgHeight();

    window.addEventListener('resize', getSlideImgHeight);

    return () => window.removeEventListener('resize', getSlideImgHeight);
  }, [anchorClass, children]);

  return (
    <Container ref={slideImgRef} overflow={overflow}>
      <SwiperStyled
        slideimageheight={slideImageHeight}
        spaceBetween={spaceBetween}
      >
        {children}
      </SwiperStyled>
    </Container>
  );
};

export default SwiperCarousel;
