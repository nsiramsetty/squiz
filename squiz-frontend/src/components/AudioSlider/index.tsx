import styled from '@emotion/styled';
import Slider, { SliderProps } from '@material-ui/core/Slider';
import React from 'react';

const SliderStyled = styled(Slider)`
  padding: 6px 0;
  position: relative;
  display: block;
  &:hover {
    .MuiSlider-track,
    .MuiSlider-rail {
      height: 6;
      top: 5;
    }
  }
  .MuiSlider-thumb {
    height: 15px;
    width: 15px;
    background-color: #fff;
    margin-top: -6px;
    margin-left: -6px;
    &:hover {
      box-shadow: 0 0 0 8px rgb(255 255 255 / 10%);
    }
    &:active {
      box-shadow: 0 0 0 14px rgb(255 255 255 / 10%);
    }
  }
  .MuiSlider-track,
  .MuiSlider-rail {
    height: 4px;
    border-radius: 2px;
  }
  .MuiSlider-track {
    background-color: #fff;
  }
  .MuiSlider-rail {
    opacity: 1;
    color: rgb(255 255 255 / 15%);
  }
`;

const AudioSlider: React.FC<SliderProps> = props => {
  return <SliderStyled {...props} />;
};

export default AudioSlider;
