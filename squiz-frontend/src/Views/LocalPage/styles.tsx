import styled from '@emotion/styled';

export const Title = styled.h1`
  font-weight: 800;
  font-size: 40px;
  margin: 15px;
  text-align: center;
  width: 100%;
  @media (max-width: 600px) {
    font-size: 32px;
  }
`;

export const TitleSection = styled.div`
  text-align: center;
  min-height: 40vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 600px) {
    min-height: 70vh;
  }
`;

export const PageDescription = styled.div`
  font-size: 24px;
  max-width: 800px;
  text-align: center;
  margin: 15px;
  @media (max-width: 1280px) {
    font-size: 20px;
  }
`;

export const TilesContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin: -20px;
  @media (max-width: 600px) {
    margin: 0px;
  }
`;

export const GlobeContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  overflow: auto;
`;

export const StyledLink = styled.a`
  font-size: 18px; 
  line-height: 20px;
  font-weight: 600;
  
  @media (max-width: 600px) {
    padding-left: 0px;   
  }
`;

export const StyledMeditators = styled.div`
  font-size: 18px;
  color: #909ba6;
  font-weight: normal;
  
  @media (max-width: 600px) {
    padding-left: 0px;   
  }
`;

export const TileItemContainer = styled.div`
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
  @media (min-width: 1610px) {
    width: 25%;
  }
  @media (max-width: 1610px) {
    width: 33.3333333%;
  }
  @media (max-width: 945px) {
    width: 50%;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 0px;
    margin-bottom: 30px;
  }
`;

export const PublisherTileMaxWidth = styled.div`
  border-radius: 16px;
  width: 1300px;
  background-color: #f4f4f4;
  padding: 36px;
  @media (max-width: 600px) {
    width: 100%;
    background-color: transparent;
    padding: 0px;
  }
`;

export const PublisherTileWrapper = styled.div<{ index: number }>`
  display: flex;
  flex-direction: row;
  justify-content: ${props => (props.index % 2 ? 'flex-end' : 'flex-start')};
  margin-bottom: 30px;
`;
