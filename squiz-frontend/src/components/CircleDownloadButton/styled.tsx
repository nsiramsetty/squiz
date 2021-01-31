import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

export const DownloadButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #222222;
  font-family: ProximaNova;
  font-size: 16px;
  font-weight: 600;
  line-height: 25px;
  letter-spacing: 0.5px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover,
  :focus {
    background-color: rgba(0, 0, 0, 0.75);
    outline: 0;
  }
` as typeof Button;

export default DownloadButton;
