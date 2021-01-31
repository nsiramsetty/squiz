/**
 * We use 'auto' slides per view and free mode, so there is just 1 setting for all our carousels.
 * To control how many appear in a row responsively, we control the widths of the child slides.
 */

import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';
import { StylesProvider } from '@material-ui/core/styles';
import React, { ReactElement } from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { ReactComponent as ChevronLeft } from './assets/arrowleft.svg';
import { ReactComponent as ChevronRight } from './assets/arrowright.svg';

interface SwiperButtonProps {
  spaceBetween?: [number, number, number, number];
  slideimageheight?: number;
}

const buttonSize = 50;

const StyledArrow = styled.div<{
  slideimageheight?: number;
}>`
  .styled-arrow {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    position: absolute;
    margin-top: -${buttonSize / 2}px;
    border-radius: ${buttonSize / 2}px;
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
    background: white;
    display: flex;
    justify-content: center;
    align-content: center;
    top: ${props =>
      props.slideimageheight ? `${props.slideimageheight / 2}px` : '50%'};
    :hover {
      background: white;
    }
    :focus {
      outline: 0;
    }
    @media (max-width: 600px) {
      display: none;
    }
  }

  .swiper-button-prev {
    left: -25px;
  }

  .swiper-button-next {
    right: -25px;
  }
`;
const SwiperButton = styled(IconButton)<SwiperButtonProps>`
  @media (max-width: 600px) {
    display: none;
  }
`;

const SwiperStyled: React.FC<SwiperButtonProps> = ({
  spaceBetween,
  slideimageheight,
  children
}) => {
  return (
    <StylesProvider injectFirst>
      <StyledArrow slideimageheight={slideimageheight}>
        <Swiper
          freeMode
          rebuildOnUpdate
          grabCursor
          slidesPerView="auto"
          breakpoints={{
            0: {
              spaceBetween: spaceBetween ? spaceBetween[0] : 13
            },
            600: {
              spaceBetween: spaceBetween ? spaceBetween[1] : 50
            },
            960: {
              spaceBetween: spaceBetween ? spaceBetween[2] : 50
            },
            1280: {
              spaceBetween: spaceBetween ? spaceBetween[3] : 50
            }
          }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next'
          }}
          renderPrevButton={() => (
            <SwiperButton className="swiper-button-prev styled-arrow">
              <ChevronLeft color="#1b1b1b" />
            </SwiperButton>
          )}
          renderNextButton={() => (
            <SwiperButton className="swiper-button-next styled-arrow">
              <ChevronRight color="#1b1b1b" />
            </SwiperButton>
          )}
        >
          {children as ReactElement}
        </Swiper>
      </StyledArrow>
    </StylesProvider>
  );
};

export default SwiperStyled;
