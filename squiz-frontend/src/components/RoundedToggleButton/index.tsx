import styled from '@emotion/styled';
import { StylesProvider } from '@material-ui/core/styles';
import ToggleButton, { ToggleButtonProps } from '@material-ui/lab/ToggleButton';
import React from 'react';
import { breakpoints } from '../../styles/breakpoints';

export const ToggleButtonStyled = styled(ToggleButton)`
  height: 34px;
  font-size: 16px;
  font-family: ProximaNova-Regular, sans-serif;
  color: #8d8d8d;
  background-color: transparent;
  @media (max-width: ${breakpoints.down.xs}) {
    min-height: 34px;
    font-size: 12px;
    font-family: ProximaNova-Semibold, sans-serif;
    color: #181818;
    background-color: #f4f4f4;
    max-width: 100px;
    box-sizing: border-box;
    line-height: 1rem;
    font-weight: normal;
    height: auto !important;
  }
  &,
  &:focus {
    outline: none;
  }
  &.Mui-selected {
    font-family: ProximaNova-Semibold, sans-serif;
    color: #181818;
    background-color: #f4f4f4;
  }
  &,
  &.MuiToggleButtonGroup-grouped:not(:first-child),
  &.MuiToggleButtonGroup-grouped:not(:last-child) {
    border: none;
    border-radius: 9999px;
    padding: 0px 20px;
    @media (max-width: ${breakpoints.down.xs}) {
      display: block;
      padding: 2px 15px;
      &.Mui-selected {
        color: white;
        background-color: black;
      }
    }
  }
  &.MuiToggleButtonGroup-grouped:not(:last-child) {
    margin-right: 10px;
  }
`;

const StyledToggleButton: React.FC<ToggleButtonProps> = props => (
  <StylesProvider injectFirst>
    <ToggleButtonStyled {...props} />
  </StylesProvider>
);

export default StyledToggleButton;
