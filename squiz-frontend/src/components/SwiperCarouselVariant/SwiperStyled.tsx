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
import { ReactComponent as ChevronLeft } from './assets/chevron_left-24px.svg';
import { ReactComponent as ChevronRight } from './assets/chevron_right-24px.svg';

interface SwiperProps {
  loop: boolean;
  buttonTop: number;
  spaceBetween?: [number, number, number, number];
}

const StyledArrow = styled.div`
  .styled-arrow {
    width: 38px;
    height: 38px;
    position: absolute;
    border-radius: 18px;
    background: #f4f4f4;
    display: flex;
    justify-content: center;
    align-content: center;
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
    left: unset;
    right: 44px;
  }

  .swiper-button-next {
    right: 0;
  }
`;

const SwiperButton = styled(IconButton)`
  @media (max-width: 600px) {
    display: none;
  }
`;

const SwiperStyled: React.FC<SwiperProps> = ({
  loop,
  buttonTop,
  spaceBetween,
  children
}) => {
  return (
    <StylesProvider injectFirst>
      <StyledArrow>
        <Swiper
          freeMode
          rebuildOnUpdate
          grabCursor
          loop={loop}
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
            <SwiperButton
              className="swiper-button-prev styled-arrow"
              style={{ top: `${buttonTop}px` }}
            >
              <ChevronLeft color="#1b1b1b" />
            </SwiperButton>
          )}
          renderNextButton={() => (
            <SwiperButton
              className="swiper-button-next styled-arrow"
              style={{ top: `${buttonTop}px` }}
            >
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
