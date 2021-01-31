import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

export const SelectorButton = styled(Button)`
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: -0.1px;
  color: #ffffff;
  transition: 0.4s;
  height: 40px;
  letter-spacing: 0.22px;
  padding: 0 8px 0 7px;
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  height: 30px;

  span {
    justify-content: flex-start;
  }

  &:hover {
    background-color: #212529;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    background: #181818;
    color: #ffffff;
  }
`;

export const SelectorButtonLabel = styled.div`
  flex: 1;
  text-align: left;
`;

export const LanguagePopover = styled(Popover)`
  .MuiPopover-paper {
    font-size: 15px;
    box-shadow: 0 9px 20px -2px rgba(0, 0, 0, 0.15);
    margin-top: -10px;
    background-color: #fff;

    .MuiContainer-maxWidthLg {
      padding-left: 40px;
      padding-right: 40px;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  padding: 24px 0 0;

  @media (min-width: 1280px) {
    padding: 24px 32px;
  }
  @media (max-width: 767px) {
    padding: 0 30px;
  }
`;

export const LanguageButton = styled(Button)`
  color: #6e6e71;
  font-size: 16px;
  font-family: ProximaNova;
  font-weight: 600;
  background: transparent;
  display: block;
  text-align: left;
  padding: 8px 0;
  transition: 0.3s;
  position: relative;

  &:hover {
    color: #181818;
    background: transparent;
  }

  &:disabled {
    background: transparent;
    color: #cbcbcb;
  }

  &:focus {
    outline: none;
  }

  @media (min-width: 1280px) {
    padding: 8px;
  }
`;

export const LanguageButtonIndicator = styled.div`
  position: absolute;
  width: 7px;
  height: 7px;
  background: #6e6e71;
  border-radius: 7px;
  left: -12px;
  top: 18px;
`;
