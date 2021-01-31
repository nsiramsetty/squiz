import styled from '@emotion/styled';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const StyledButton = styled(Button)<ButtonProps>`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: ${props =>
    props.disabled ? '#9a9a9a!important' : '#222222'};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  :focus,
  :hover {
    background-color: #3c3a3a;
    outline: 0;
  }
` as typeof Button;

export const StyledLockIcon = styled.img`
  width: 12px;
  height: 14px;
  object-fit: contain;
  margin-right: 8px;
  margin-bottom: 4px;
`;

export const StyledTickIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  margin-right: 7px;
`;

export const StyledText = styled.span`
  color: #fff;
  font-family: ProximaNova;
  font-size: 16px;
  font-weight: 600;
  line-height: 25px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
`;
