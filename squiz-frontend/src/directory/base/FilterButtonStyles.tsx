import styled from '@emotion/styled';

export default styled.div`
  display: flex;
  alignitems: flex-start;
  padding-top: 1rem;
  @media (max-width: 768px) {
    display: block;
  }
  h2 {
    width: 13%;
    padding: 0.5rem 0 0.5rem 0;
    margin-right: 0.75rem;
    font-family: ProximaNova-Bold, sans-serif;
    align-items: center;
    display: flex;
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  .browser-wrap {
    width: 100%;
    display: flex;
    @media (max-width: 768px) {
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }

  .filter-link {
    min-width: 2rem;
    text-transform: capitalize;
    text-align: center;
    padding: 0.25rem 0.5rem;
    line-height: 2;
    border-radius: 9999px;
    color: #8d8d8d;
    @media (max-width: 768px) {
      background-color: #f4f4f4;
      margin: 0.25rem;
      &:hover {
        background-color: #f4f4f4;
      }
    }
  }
  .filter-link.isAvailable {
    color: #22292f;
    @media (max-width: 768px) {
      background-color: #f4f4f4;
      margin: 0.25rem;
      &:hover {
        background-color: #22292f;
        color: #ffffff !important;
      }
    }
  }
  .filter-link.active {
    color: #181818;
    background-color: #f4f4f4;
    @media (max-width: 768px) {
      color: #ffffff;
      background-color: #22292f;
    }
  }
`;
