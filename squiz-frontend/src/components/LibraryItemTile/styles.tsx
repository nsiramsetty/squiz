import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import { ReactComponent as MusicIcon } from './assets/music-icon.svg';
import { ReactComponent as StarIcon } from './assets/star-icon.svg';

export const TileItemContainer = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 8px;
  transition: 0.4s;
  height: 100%;
  width: 100%;
  padding-top: 100%;
  border-radius: 6px;
  position: relative;
`;

export const StyledTileButton = styled(Button)`
  width: 100%;
  position: relative;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 7px;
  text-transform: none;
  margin-top: 10px;
  padding: 0;
  z-index: 20;
  overflow: hidden;
  ::before {
    padding: 0;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  transition: 0.4s;

  :hover,
  :focus,
  :active {
    background-color: transparent;
  }

  @media (min-width: 960px) {
    :hover {
      transform: translate(0, -8px);
      box-shadow: 0 10px 40px -10px rgba(24, 24, 24, 0.5);
    }
  }
` as typeof Button;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  top: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const StyledOverlay = styled.div<{
  load?: boolean;
}>`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  background: ${props =>
    props.load
      ? 'linear-gradient(to bottom,rgba(0, 0, 0, 0),rgba(0, 0, 0, 0) 55%,rgba(0, 0, 0, 0.4) 100%)'
      : 'rgba(0,0,0,0.1)'};
`;

export const StyledText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const StyledTitle = styled(Button)`
  font-family: ProximaNova;
  font-size: 17px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: -0.09px;
  color: #222222;
  text-transform: none;
  padding: 0;
  text-align: left;
  display: inline-block;
  :hover,
  :focus {
    background: transparent;
    outline: 0;
  }
` as typeof Button;

export const StyledTeacherButton = styled(Button)`
  font-family: ProximaNova;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: -0.09px;
  text-transform: none;
  padding: 0;
  text-align: left;
  color: #5a5a5a;
  :hover,
  :focus {
    background: transparent;
    outline: 0;
  }
  .MuiButton-label {
    justify-content: flex-start;
  }
` as typeof Button;

export const StyledDuration = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  height: 24px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.15);
  font-family: ProximaNova;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.12px;
  color: #ffffff;
  padding: 0 8px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`;

export const StyledRating = styled.div`
  display: flex;
  align-items: center;
  font-family: ProximaNova;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: -0.09px;
`;

export const StyledRatingScore = styled.span`
  color: #5a5a5a;
  display: inline-block;
  margin-right: 4px;
`;

export const StyledRatingCount = styled.span`
  color: #9a9a9a;
`;

export const StyledMusicIcon = styled(MusicIcon)`
  margin-left: 5px;
`;

export const StyledStarIcon = styled(StarIcon)`
  margin-right: 4px;
  position: relative;
  top: -1px;
`;
