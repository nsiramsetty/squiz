import styled from '@emotion/styled';

export const KitActionText = styled.div`
  font-family: JennaSue;
  font-size: 38px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.53;
  letter-spacing: 0.95px;
  text-align: center;
  color: #ffffff;
`;

export const KitTitleText = styled.div`
  font-family: ProximaNova;
  font-size: 56px;
  @media (max-width: 1400px) {
    font-size: 48px;
  }
  @media (max-width: 600px) {
    font-size: 56px;
  }
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.68;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin-top: 18px;
  margin-bottom: 28px;
`;

export const FreeTitlesCount = styled.div`
  font-family: ProximaNova;
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 20px;
  letter-spacing: 0.21px;
  text-align: center;
  color: #ffffff;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(50px);
  height: 40px;
  padding: 10px 20px;
  width: auto;
`;

export const SlideContainer = styled.div`
  height: 100%;
  width: calc((100% - 80px) / 5) !important;
  @media (max-width: 1400px) {
    width: calc((100% - 60px) / 4) !important;
  }
  @media (max-width: 1280px) {
    width: calc((100% - 39px) / 4) !important;
  }
  @media (max-width: 992px) {
    width: calc((100% - 26px) / 3) !important;
  }
  @media (max-width: 768px) {
    width: calc((100% - 13px) / 2) !important;
  }
  @media (max-width: 600px) {
    width: 95% !important;
  }
  margin-bottom: 20px;
`;

export const ButtonContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
