import styled from '@emotion/styled';

export const HeaderContainer = styled.header`
  position: fixed;
  z-index: 1100;
  width: 100%;
  top: 0;
`;

export const HeaderBackground = styled.div<{
  scrolled: boolean;
  shadow: boolean;
  transparent?: boolean;
}>`
  width: 100%;
  background: ${props => (props.transparent === true ? 'none' : '#fff')};
  transition: box-shadow, height 0.3s ease-out;
  height: 64px;
  ${props =>
    props.scrolled &&
    props.shadow &&
    'box-shadow: 0 3px 20px -2px rgba(0, 0, 0, 0.12);'}
  @media (min-width: 1280px) {
    height: ${props => (props.scrolled ? 64 : 96)}px;
  }
`;

export const HeaderBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 100%;
`;

export const HeaderSpacing = styled.div<{
  height: number;
}>`
  height: ${props => props.height}px;
`;

export const DesktopContainer = styled.div`
  max-width: 1800px;
  margin: auto;
  width: 100%;
  padding-left: 64px;
  padding-right: 64px;
  height: 100%;
  @media (max-width: 1681px) {
    padding-left: 40px;
    padding-right: 40px;
  }
  @media (max-width: 600px) {
    padding-left: 13px;
    padding-right: 13px;
  }
`;

export const MobileContainer = styled.div`
  height: 100%;
  padding: 0 32px;
`;

export const BowlLogo = styled.img`
  height: 24px;
  margin-right: 12px;
`;

export const TextLogo = styled.img`
  height: 20px;
`;

export const DesktopNavs = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const RightNavs = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  min-width: 188px;
`;

export const Text = styled.p`
  color: #fff;
  font-family: ProximaNova;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.24px;
  text-align: center;
`;
