import styled from '@emotion/styled';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import React from 'react';

export const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const FormLabel = styled.div`
  font-family: ProximaNova;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  color: #222222;
  margin-right: auto;
  letter-spacing: 0.2px;
`;

export const TermsContainer = styled.div`
  font-family: ProximaNova;
  font-size: 10px;
  color: #9a9a9a;
  line-height: 15px;
  letter-spacing: 0.5px;
  text-align: center;
`;

type InputProps = InputBaseProps & {
  paddingRight?: number;
};

const StyledInputBase = styled(InputBase)<InputProps>`
  width: 100%;
  letter-spacing: 1px;
  line-height: 50px;

  .MuiInputBase-input,
  .MuiInputBase-input.MuiInputBase-inputAdornedEnd {
    border-radius: 10px;
    width: 100%;
    line-height: 25px;
    border: solid 1px #ebebeb;
    outline: 0;
    padding-top: 13px;
    padding-bottom: 13px;
    padding-left: 12px;
    letter-spacing: 1px;
    padding-right: ${props => props.paddingRight || 12}px;
    font-size: 18px;
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
    font-size: 18px !important;
  }
  .MuiInputBase-input:-internal-autofill-selected {
    font-size: 18px !important;
    -webkit-text-fill-color: ${props =>
      props.disabled ? `grey!important` : `black!important`};
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    font-family: ProximaNova;
    font-weight: normal;
    color: #d2d2d2;
  }
`;

export const InputText: React.FC<InputProps> = props => (
  <StyledInputBase {...props} />
);
