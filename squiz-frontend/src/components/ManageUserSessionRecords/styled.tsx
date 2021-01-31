import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

export const StyledContainer = styled.div`
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
`;

export const Table = styled.div`
  position: relative;
`;

export const TTitle = styled.h2`
  position: sticky;
  top: 65px;
  font-size: 24px;
  font-weight: 300;
  font-family: ProximaNova;
  color: #181818;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 58px;
  background: rgba(255, 255, 255, 0.85);
  z-index: 10;
  @media (max-width: 600px) {
    top: 70px;
  }
`;

export const TRow = styled.div<{
  noBorder?: boolean;
}>`
  display: flex;
  align-items: center;
  border-bottom: ${props => (props.noBorder ? 'none' : 'solid 1px #eee')};

  @media (max-width: 600px) {
    display: block;
    padding-top: 15px;
    padding-bottom: 15px;
  }
`;

export const TColumn = styled.div<{
  head?: boolean;
  left?: boolean;
}>`
  font-size: ${props => (props.head ? 16 : 18)}px;
  padding: ${props => (props.head ? 20 : 15)}px 10px;
  font-weight: ${props => (props.head ? 400 : 300)};
  color: ${props => (props.head ? '#a9a9a9' : '#181818')};
  text-align: ${props => (props.left ? 'left' : 'center')};
  font-family: ProximaNova;

  &:nth-of-type(1) {
    width: 40%;
  }

  &:nth-of-type(2) {
    width: 20%;
  }

  &:nth-of-type(3) {
    width: 30%;
  }

  &:nth-of-type(4) {
    width: 10%;
  }

  @media (max-width: 600px) {
    display: ${props => (props.head ? 'none' : 'block')};
    text-align: left;
    width: 100% !important;
    padding: 3px 0;
    font-size: 14px;

    &:before {
      display: inline-block;
      content: attr(data-label);
      color: #a9a9a9;
      font-weight: 400;
      font-size: 14px;
      font-family: ProximaNova;
      margin-right: ${props => (props.left ? 0 : 5)}px;
    }

    &:last-child:before {
      margin: 0;
    }
  }
`;

export const TLoader = styled.div<{
  width: string;
}>`
  width: ${props => props.width};
  background: #f5f5f5;
  height: 38px;
  margin: 0 auto;
  @media (max-width: 600px) {
    height: 16px;
    margin: 0;
  }
`;

export const ContainedButton = styled(Button)`
  text-transform: none;
  font-family: ProximaNova;
  font-size: 15px;
  padding: 6px 30px;
  background: #181818;
  color: #fff;
  border-radius: 6px;
  transition: 0.7s;

  &:hover {
    opacity: 0.75;
    background: #181818;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
