import styled from '@emotion/styled';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const ButtonContent = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10;
  ::before {
    position: relative;
    height: 100%;
    width: 100%;
  }
`;

export const StyledButton = styled(Button)<
  ButtonProps & {
    paddingtop: [string, string];
    radius?: string;
    disableup?: number;
    border?: string;
  }
>`
  position: relative;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-top: ${props => props.paddingtop[1] || '100%'};
  border: ${props => props.border || 'solid 1px rgba(0, 0, 0, 0.04)'};
  border-radius: ${props => (props.radius ? props.radius : `10px`)};
  background-color: rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: 0.4s;
  overflow: hidden;
  @media (max-width: 768px) {
    padding-top: ${props => props.paddingtop[0] || '100%'};
  }
  :hover {
    transform: ${props => (props.disableup ? 'none' : 'translate(0, -8px)')};
    box-shadow: 0 10px 40px -10px rgba(24, 24, 24, 0.5);
    .group-background:after {
      transition: 2.5s ease-out;
      transform: scale(1.07);
    }
  }
  text-transform: none;
`;

export const TileBackground = styled.div<{
  bgImage?: string;
  bgImageMobile?: string;
  border?: string;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.3;
    z-index: 5;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 1%,
      rgba(0, 0, 0, 0.8) 73%,
      #000000
    );
  }

  ::after {
    content: '';
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    transition: 0.6s;
    border-radius: 6px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    background-image: url(${props => props.bgImage});
    @media (max-width: 600px) {
      background-image: url(${props => props.bgImageMobile});
    }
  }
`;
