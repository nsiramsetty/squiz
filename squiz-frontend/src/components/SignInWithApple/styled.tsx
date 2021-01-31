import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

export const StyledButton = styled(Button)`
  height: 44px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ebebeb;
  background-color: #ebebeb;
  padding-left: 7px;
  padding-right: 7px;
  :disabled {
    border: 1px solid #ebebeb;
  }
`;

export const IconWrapper = styled.div`
  height: 100%;
  width: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

export const ProgressWrapper = styled.div`
  width: 19px;
  height: 19px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 4px;
  color: #181818;
`;

export const StyledSpan = styled.span`
  width: 100%;
  font-family: ProximaNova !important;
  font-size: 15px;
  letter-spacing: 0.17pt;
  text-transform: none;
  font-weight: 600;
`;
