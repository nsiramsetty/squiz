import styled from '@emotion/styled';
import Box, { BoxProps } from '@material-ui/core/Box';

export const RichTextWrapper = styled.div`
  font-family: ProximaNova;

  h1,
  h2 {
    font-weight: 800;
  }
  h3 {
    font-weight: 700;
  }
  b {
    font-weight: 700 !important;
    opacity: 1 !important;
  }

  h1,
  h2,
  h3,
  p {
    line-height: 1.25;
  }

  h1,
  h2,
  h3 {
    margin-bottom: 20px;
  }

  p:not(:last-of-type) {
    margin-bottom: 20px;
  }

  ul,
  ol {
    padding-left: 16px;
  }

  p {
    font-size: 24px;
    opacity: 0.75;
    line-height: 1.5;

    @media (max-width: 600px) {
      font-size: 20px;
    }
  }

  a {
    transition: all 0.3s ease;
    opacity: 0.6;

    &:hover {
      opacity: 0.5;
    }
  }

  h1 {
    font-size: 60px;
    @media (max-width: 600px) {
      font-size: 40px;
    }
  }

  h2 {
    font-size: 46px;
    @media (max-width: 600px) {
      font-size: 28px;
    }
  }

  h3 {
    font-size: 32px;
    opacity: 0.75;
    @media (max-width: 600px) {
      font-size: 26px;
    }
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  :after {
    display: block;
    content: '';
    clear: both;
    height: 1px;
  }
`;

/* color: ${props => (props.bgColor ? `#ffffff` : '#181818')};
  ${props => (props.bgColor ? `background: #${props.bgColor};` : '')}
  ${props => (props.bgColor ? `padding: 68px 0;` : '')} */

export const TextSegmentBackground = styled(Box)<BoxProps>`
  max-width: 1700px;
  margin: auto;
  width: 100%;
  border-radius: 30px;
  @media (max-width: 1700px) {
    border-radius: 0px;
  }
`;

export const Column = styled(Box)`
  width: 40%;
  @media (max-width: 1280px) {
    width: 45%;
  }
  @media (max-width: 960px) {
    width: 100%;
  }
`;

export const Row = styled(Box)`
  width: 100%;
`;

export const AspectRatio = styled(Box)`
  width: 100%;
  padding-top: 40%;
  position: relative;
  @media (max-width: 600px) {
    padding-top: 75%;
  }
`;

export const StyledImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

export const CenterLeft = styled(Box)`
  width: 100%;
  height: auto;
  margin: auto;
  padding-bottom: 50px;

  @media (max-width: 960px) {
    width: 55%;
  }
  @media (max-width: 600px) {
    width: 70%;
  }
`;

export const CenterRight = styled(Box)`
  width: 100%;
  height: auto;
  margin: auto;
  padding-top: 50px;

  @media (max-width: 960px) {
    width: 55%;
  }
  @media (max-width: 600px) {
    width: 70%;
  }
`;

export const FloatLeft = styled(Box)`
  max-width: 40%;
  float: left;
  padding-right: 30px;
  padding-bottom: 30px;
  @media (max-width: 1280px) {
    max-width: 50%;
  }
  @media (max-width: 600px) {
    max-width: 50%;
    padding-right: 20px;
    padding-bottom: 20px;
  }
`;

export const FloatRight = styled(Box)`
  max-width: 40%;
  float: right;
  padding-left: 30px;
  padding-bottom: 30px;
  @media (max-width: 1280px) {
    max-width: 50%;
  }
  @media (max-width: 600px) {
    max-width: 50%;
    padding-right: 20px;
    padding-bottom: 20px;
  }
`;
