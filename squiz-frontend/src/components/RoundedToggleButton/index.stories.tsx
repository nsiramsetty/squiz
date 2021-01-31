import styled from '@emotion/styled';
import Container from '@material-ui/core/Container';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { State, Store } from '@sambego/storybook-state';
import React from 'react';
import 'tailwind.css';
import RoundedToggleButton from './index';

const store = new Store({
  sortOption: 'popular',
  lengthOption: '0to5',
  handleSort: (e: any, v: string) => store.set({ sortOption: v }),
  handleLength: (e: any, v: string) => store.set({ lengthOption: v }),
});

/* eslint-disable react-hooks/rules-of-hooks */
const RoundedToggleButtonStyled = styled(RoundedToggleButton)`
  &.MuiToggleButtonGroup-grouped:not(:last-child) {
    margin-right: 20px;
  }
`;

export const InToggleButtonGroup = () => {
  return (
    <State store={store}>
      {(state) => (
        <Container>
          <ToggleButtonGroup
            className="bg-transparent w-full sm:w-auto"
            exclusive
            onChange={state.handleSort}
            value={state.sortOption}
          >
            <RoundedToggleButton value="popular">Popular</RoundedToggleButton>
            <RoundedToggleButton value="newest">Newest</RoundedToggleButton>
          </ToggleButtonGroup>
        </Container>
      )}
    </State>
  );
};

export const WithCustomMargin = () => {
  return (
    <State store={store}>
      {(state) => (
        <Container>
          <ToggleButtonGroup
            className="bg-transparent w-full sm:w-auto"
            exclusive
            onChange={state.handleSort}
            value={state.sortOption}
          >
            <RoundedToggleButtonStyled value="popular">
              Popular
            </RoundedToggleButtonStyled>
            <RoundedToggleButtonStyled value="newest">
              Newest
            </RoundedToggleButtonStyled>
          </ToggleButtonGroup>
        </Container>
      )}
    </State>
  );
};

export const InDesktopMenu = () => {
  return (
    <State store={store}>
      {(state) => (
        <Container>
          <ToggleButtonGroup
            exclusive
            onChange={state.handleLength}
            value={state.lengthOption}
          >
            <RoundedToggleButton
              className="text-base h-8 mr-3"
              value="0to5"
              classes={{ selected: 'text-xdark_ bg-xlightgrey_' }}
            >
              Short
            </RoundedToggleButton>
            <RoundedToggleButton
              className="text-base h-8 mr-3"
              value="5to30"
              classes={{ selected: 'text-xdark_ bg-xlightgrey_' }}
            >
              Long
            </RoundedToggleButton>
            <RoundedToggleButton
              className="text-base h-8 mr-3"
              value="30to"
              classes={{ selected: 'text-xdark_ bg-xlightgrey_' }}
            >
              Extended
            </RoundedToggleButton>
          </ToggleButtonGroup>
        </Container>
      )}
    </State>
  );
};

export const inMobileMenu = () => {
  return (
    <State store={store}>
      {(state) => (
        <Container style={{ width: '320px' }}>
          <ToggleButtonGroup
            exclusive
            onChange={state.handleLength}
            value={state.lengthOption}
          >
            <RoundedToggleButton
              className="text-base h-8 mr-3"
              value="0to5"
              classes={{ selected: 'text-white bg-black mr-3' }}
            >
              Short
            </RoundedToggleButton>
            <RoundedToggleButton
              className="text-base h-8 mr-3"
              value="5to30"
              classes={{ selected: 'text-white bg-black mr-3' }}
            >
              Long
            </RoundedToggleButton>
            <RoundedToggleButton
              className="text-base h-8 mr-3"
              value="30to"
              classes={{ selected: 'text-white bg-black mr-3' }}
            >
              Extended
            </RoundedToggleButton>
          </ToggleButtonGroup>
        </Container>
      )}
    </State>
  );
};

export default { title: 'RoundedToggleButton' };
