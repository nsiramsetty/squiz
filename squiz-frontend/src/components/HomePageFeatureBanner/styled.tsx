import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

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
  font-size: 62px;
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
    width: 70% !important;
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

export const TileTitle = styled.div`
  font-family: ProximaNova;
  font-size: 48px;
  @media (max-width: 1400px) {
    font-size: 42px;
  }
  @media (max-width: 768px) {
    font-size: 40px;
  }
  margin-left: -2px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.1;
  text-align: left;
  letter-spacing: normal;
  color: #ffffff;
  width: 82%;
`;

export const FeatureTileButtonContent = styled.div<{
  isActive?: boolean;
}>`
  ${props => (props.isActive ? 'box-shadow: inset 0 0 0 3px #b90c4e;' : '')}
  border-radius: 11px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  position: relative;
  padding: 13.5% 8%;
  @media (max-width: 768px) {
    padding: 9% 7%;
  }
`;

export const TileInfo = styled.div`
  font-family: ProximaNova;
  font-size: 16px;
  @media (max-width: 1280px) {
    font-size: 15px;
  }
  @media (max-width: 992px) {
    font-size: 16px;
  }
  width: 100%;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  text-align: left;
  letter-spacing: 0.21px;
  color: #ffffff;
`;

export const TruncatedText = styled.div`
  white-space: nowrap;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const JoinButton = styled(Button)`
  outline: 0;
  width: 122px;
  height: 34px;
  border-radius: 4px;
  background-color: #a2094d;
  line-height: 1.47;
  letter-spacing: -0.19px;
  font-family: ProximaNova;
  font-weight: 600;
  color: white;
  text-align: center;
  font-size: 15px;
  :hover {
    background-color: #8a0741;
  }
`;

export const Attendees = styled.div`
  font-family: ProximaNova;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.17px;
  font-weight: 500;
  line-height: 20px;
`;
