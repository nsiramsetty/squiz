import styled from '@emotion/styled';

export default styled.div`
  padding: 0 40px;
  padding-bottom: 32px;
  padding-top: 30px;
  margin: auto;
  width: 100%;
  @media (max-width: 768px) {
    padding-left: 13px;
    padding-right: 13px;
  }

  .course-title {
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
  .course-block {
    width: 33%;
    padding-top: 1.25rem;
    padding-bottom: 20px;
  }
  .course-block > div {
    width: 100%;
  }
  .featured-title {
    padding: 0.5rem 0;
    font-family: ProximaNova-Bold, sans-serif;
    align-items: center;
    display: flex;
    text-transform: capitalize;
    padding-bottom: 12px;
  }
`;
