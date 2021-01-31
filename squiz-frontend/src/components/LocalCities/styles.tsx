import styled from '@emotion/styled';

export const StyledLink = styled.a`
  font-size: 18px;
  line-height: 20px;
  font-weight: 600;
  z-index: 10;
  position: relative;
  @media (max-width: 600px) {
    font-size: 16px;
    margin: 5px;
    display: inline-block;
  }
`;

export const StyledMeditators = styled.div`
  font-size: 18px;
  color: #909ba6;
  font-weight: normal;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;
