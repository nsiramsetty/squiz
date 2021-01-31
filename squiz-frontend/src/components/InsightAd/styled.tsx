import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import { ReactComponent as FreeSvg } from 'assets_2/images/library/free.svg';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;
export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
`;

export const StyledLogo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 600px) {
    width: 188px;
  }
`;

export const StyledBowlLogo = styled.img`
  width: 56.4px;
  margin-right: 14.4px;
`;

export const StyledTextLogo = styled.img`
  height: 26.2px;

  @media (max-width: 600px) {
    height: 20px;
  }
`;

export const ContentOnImage = styled.div`
  width: 100%;
  top: 12%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
`;

export const Heading = styled.h1`
  font-family: ProximaNova;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 35px;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 700px;
  margin: auto;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 38px;
  }
`;

export const FreeText = styled(FreeSvg)`
  display: inline;
  margin-top: -16px;
  height: 50px;
  width: 55px;
  margin-left: 8px;
`;

export const LearnMore = styled(Button)`
  background-color: transparent;
  font-family: ProximaNova;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: normal;
  color: #ffffff;
  padding: 0;
  :focus,
  :hover {
    background-color: transparent;
    outline: 0;
  }
  :hover {
    text-decoration: underline;
  }
`;
