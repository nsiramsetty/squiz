import styled from '@emotion/styled';

export default styled.div`
  padding-bottom: 32px;
  padding-top: 30px;

  .local-title {
    width: 100%;
    border-bottom: 2px solid rgba(0, 0, 0, 0.09);
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
      font-family: ProximaNova-Bold, sans-serif;
      align-items: center;
      display: flex;
    }
  }
  .local-block {
    width: 100%;
    padding-top: 1.25rem;
  }
  .local-block > div {
    width: 20%;
    float: left;
    padding-bottom: 3px;
    padding-right: 0;
    @media (min-width: 1681px) {
      width: 16.66%;
    }
    @media (min-width: 600px) and (max-width: 959px) {
      width: 25%;
    }
    @media (max-width: 599px) {
      width: 50%;
    }
  }
  .featured-title {
    font-family: ProximaNova-Bold, sans-serif;
    align-items: center;
    display: flex;
    text-transform: capitalize;
    font-size: 18px;
    padding-bottom: 5px;
  }
`;
