import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

const StyledTileButton = styled(Button)`
  width: 100%;
  position: relative;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 7px;
  text-transform: none;
  margin-top: 10px;
  padding: 0;
  z-index: 20;
  overflow: hidden;
  border: solid 1px rgba(0, 0, 0, 0.04);
  ::before {
    padding: 0;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  transition: 0.4s;

  :hover,
  :focus,
  :active {
    background-color: transparent;
  }

  @media (min-width: 960px) {
    :hover {
      transform: translate(0, -8px);
      box-shadow: 0 10px 40px -10px rgba(24, 24, 24, 0.5);
    }
  }
` as typeof Button;

export default StyledTileButton;
