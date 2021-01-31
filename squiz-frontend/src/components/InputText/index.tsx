import styled from '@emotion/styled';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import React from 'react';

type InputProps = InputBaseProps & {
  paddingRight?: number;
};

const StyledInputBase = styled(InputBase)<InputProps>`
  width: 100%;
  line-height: 44px;
  .MuiInputBase-input,
  .MuiInputBase-input.MuiInputBase-inputAdornedEnd {
    width: 100%;
    line-height: 16px;
    border-radius: 4px;
    border: solid 1px #ebebeb;
    outline: 0;
    padding-top: 13px;
    padding-bottom: 13px;
    padding-left: 12px;
    padding-right: ${props => props.paddingRight || 12}px;
    font-size: 15px;
    color: ${props => (props.disabled ? `#ebebeb` : 'black')};
    font-family: ProximaNova;
  }
  .MuiInputBase-input:focus {
    border: 2px solid #181818 !important;
  }
  .MuiInputAdornment-positionEnd {
    margin-left: 0px;
  }
  .Mui-error {
    border: solid 4px red;
  }
  .MuiInputBase-input::-webkit-autofill {
    font-size: 15px !important;
  }
  .MuiInputBase-input:-internal-autofill-selected {
    font-size: 15px !important;
    -webkit-text-fill-color: ${props =>
      props.disabled ? `grey!important` : `black!important`};
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    font-family: ProximaNova;
    font-weight: normal;
    color: rgb(82, 82, 82, 0.7);
  }
`;

const InputText: React.FC<InputProps> = props => <StyledInputBase {...props} />;

export default InputText;
