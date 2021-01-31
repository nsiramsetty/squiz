/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import React from 'react';
import { ReactComponent as MemberplusIcon } from './assets/memberplus-icon.svg';
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

export const StyledTitle = styled(({ color, ...otherProps }) => (
  <Button {...otherProps} />
))`
  color: ${props => (props.color != null ? props.color : '#222222')};
  font-family: ProximaNova;
  font-size: 17px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: -0.09px;
  text-transform: none;
  padding: 0px;
  text-align: left;
  display: inline-block;
  :hover,
  :focus {
    background: transparent;
    outline: 0;
  }
`;

export const StyledTeacherButton = styled(({ color, ...otherProps }) => (
  <Button {...otherProps} />
))`
  color: ${props => (props.color != null ? props.color : '#5a5a5a')};
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
  :hover,
  :focus {
    background: transparent;
    outline: 0;
  }
  .MuiButton-label {
    justify-content: flex-start;
  }
`;

export const StyledAttributes = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

export const StyledDays = styled.div`
  height: 24px;
  border-radius: 4px;
  background-color: #fff;
  font-family: ProximaNova;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.12px;
  color: #222222;
  padding: 1px 8px 0;
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

export const StyledRatingScore = styled.span<{
  color?: string;
}>`
  color: ${props => (props.color != null ? props.color : '#5a5a5a')};
  display: inline-block;
  margin-right: 4px;
`;

export const StyledRatingCount = styled.span<{
  color?: string;
}>`
  color: ${props => (props.color != null ? props.color : '#9a9a9a')};
`;

export const StyledMemberplusIcon = styled(MemberplusIcon)`
  margin-left: 10px;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-bottom: 10px;
  }
`;

export const StyledStarIcon = styled(StarIcon)<{
  color?: string;
}>`
  color: ${props => (props.color != null ? props.color : '#9a9a9a')};
  margin-right: 3px;
  position: relative;
  top: -1px;

  path {
    fill: ${props => (props.color != null ? props.color : '#5a5a5a')};
  }
`;
