import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';
import { StylesProvider } from '@material-ui/core/styles';
import React from 'react';
import BackIcon from './backIcon.svg';

const StyledBackIconButton = styled(IconButton)`
  outline: 0;
  width: 32px;
  height: 32px;
  border-radius: 19px;
  border: solid 1px #dfdfdf;
  background-image: url(${BackIcon});
  background-repeat: no-repeat;
  background-position: center center;
  :focus {
    outline: 0;
  }
`;
type TProps = {
  onClick?: () => void;
};
const BackIconButton: React.FC<TProps> = ({ onClick }) => {
  return (
    <StylesProvider injectFirst>
      <StyledBackIconButton onClick={onClick} />
    </StylesProvider>
  );
};

export default BackIconButton;
