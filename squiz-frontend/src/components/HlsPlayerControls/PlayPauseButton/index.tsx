import React, { useState } from 'react';
import {
  StyledIconButton,
  StyledLoader,
  StyledPauseIcon,
  StyledPlayIcon
} from './styled';

interface TProps {
  isPlaying: boolean;
  isLoading: boolean;
  play: () => void;
  pause: () => void;
  onPlayClicked?: () => void;
}

const PlayPauseButton: React.FC<TProps> = ({
  isPlaying,
  isLoading,
  onPlayClicked,
  pause,
  play
}) => {
  const [isClicked, setIsClicked] = useState(false);

  if (isLoading)
    return (
      <StyledIconButton>
        <StyledLoader />
      </StyledIconButton>
    );

  if (isPlaying)
    return (
      <StyledIconButton onClick={pause}>
        <StyledPauseIcon />
      </StyledIconButton>
    );

  if (!isPlaying)
    return (
      <StyledIconButton
        onClick={() => {
          play();

          if (!isClicked && onPlayClicked) {
            onPlayClicked();
            setIsClicked(true);
          }
        }}
      >
        <StyledPlayIcon />
      </StyledIconButton>
    );

  return null;
};

export default PlayPauseButton;
