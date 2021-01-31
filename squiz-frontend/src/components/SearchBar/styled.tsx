import styled from '@emotion/styled';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import { Scrollbars } from 'react-custom-scrollbars';

export const StyledContainer = styled.div`
  position: relative;
  overflow: visible;
  width: 100%;
  z-index: 50;
  @media (min-width: 1280px) {
    padding-left: 0;
    padding-right: 0;
    margin: 0 16px;
  }
`;

export const StyledPaper = styled(Paper)`
  background: #f4f4f4;
  height: 40px;
  box-shadow: none;
  display: flex;
  border-radius: 8px;
  width: 100%;
  align-items: center;
`;

export const StyledScrollbars = styled(Scrollbars)`
  height: 480px !important;
  position: absolute !important;
  background: #fff;
  width: 100%;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 12px 0;

  @media (max-width: 1279px) {
    left: 0;
    right: 0;
    width: auto !important;
  }
`;

export const StyledInput = styled(InputBase)`
  flex: 1 1 0%;
  color: #1a1a1a;
  line-height: 1.5;
  font-size: 16px;
  font-family: ProximaNova;
`;

export const StyledLoader = styled(CircularProgress)`
  width: 20px !important;
  height: 20px !important;
  padding: 2px;
  margin: 0 8px;
`;

export const StyledIcon = styled(SearchIcon)`
  width: 20px;
  height: 20px;
  margin: 0 8px;
`;
