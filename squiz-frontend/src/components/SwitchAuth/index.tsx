import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

export const SwitchAuth = styled.div`
  line-height: 14px;
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.11px;
  color: #373943;
  margin-left: 2px;
`;

export const StyledTextButton = styled(Button)`
  font-weight: bold;
  color: #222222;
  line-height: 14px;
  font-size: 14px;
  letter-spacing: 0.1px;
  padding: 0px;
  text-transform: capitalize;
  padding-bottom: 2px;
  font-family: ProximaNova;
  min-width: 0px;
  padding-left: 4px;
  :hover,
  :focus {
    background: transparent;
    outline: 0;
  }
  span.MuiButton-label {
    display: block;
  }
` as typeof Button;
