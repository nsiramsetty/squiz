import React from 'react';
import { StyledContainer, StyledNumberAvatar, StyledText } from './styled';

type TProps = {
  text: string;
};

const NumberAvatar: React.FC<TProps> = ({ text }) => {
  return (
    <StyledContainer>
      <StyledNumberAvatar>
        <StyledText>{text}</StyledText>
      </StyledNumberAvatar>
    </StyledContainer>
  );
};

export default NumberAvatar;
