import styled from '@emotion/styled';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { ReactComponent as PauseIcon } from 'assets_2/icons/player/pause.svg';
import { ReactComponent as PlayIcon } from 'assets_2/icons/player/play.svg';

export const StyledIconButton = styled(IconButton)`
  background: #fff;
  transition: 0.5s;
  z-index: 10;
  outline: none;
  text-align: center;

  :hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.75);
  }

  :focus {
    outline: none;
    box-shadow: none;
  }
`;

export const StyledLoader = styled(CircularProgress)`
  color: #22292f;
  width: 18px !important;
  height: 18px !important;
`;

export const StyledPlayIcon = styled(PlayIcon)`
  position: relative;
  left: 2px;
  width: 18px !important;
  height: 18px !important;

  path {
    fill: #000;
  }
`;

export const StyledPauseIcon = styled(PauseIcon)`
  width: 18px !important;
  height: 18px !important;
`;
