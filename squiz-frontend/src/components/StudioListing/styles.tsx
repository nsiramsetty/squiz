import styled from '@emotion/styled';

export const StyledStudioTitle = styled.div`
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  z-index: 10;
  position: relative;
  font-family: ProximaNova;
  letter-spacing: -0.24px;
  color: #191919;
  @media (max-width: 600px) {
    font-size: 16px;
    display: inline-block;
  }
`;

export const StyledStudioInfo = styled.div`
  font-weight: normal;
  word-break: break-word;
  font-family: ProximaNova;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.19px;
  color: rgba(22, 22, 22, 0.6);
  text-align: left;

  :hover,
  :focus {
    outline: 0;
    background-color: transparent;
  }
`;

export const StyledStudioLink = styled.a`
  text-align: left;
  padding: 0;
  color: rgb(70, 130, 180) !important;
  display: inline;
`;
