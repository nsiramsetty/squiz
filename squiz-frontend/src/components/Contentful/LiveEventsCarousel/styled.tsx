import styled from '@emotion/styled';

const SlideContainer = styled.div`
  height: 100%;
  width: calc((100% - 96px) / 5);

  @media (max-width: 1550px) {
    width: calc((100% - 72px) / 4);
  }

  @media (max-width: 1280px) {
    width: calc((100% - 48px) / 3);
  }

  @media (max-width: 960px) {
    width: calc((100% - 24px) / 2);
  }
`;

export default SlideContainer;
