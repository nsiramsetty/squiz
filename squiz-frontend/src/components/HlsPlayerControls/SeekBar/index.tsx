import AudioSlider from 'components/AudioSlider';
import React, { ChangeEvent } from 'react';
import { StyledContainer, StyledWrapper } from './styled';

interface TProps {
  max: number;
  value: number;
  onChange: (event: ChangeEvent<{}>, value: number | number[]) => void;
}

const SeekBar = (props: TProps) => {
  return (
    <StyledContainer>
      <StyledWrapper>
        <AudioSlider {...props} />
      </StyledWrapper>
    </StyledContainer>
  );
};

export default SeekBar;
