import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

const StyledButton = styled(Button)<{
  loading: number;
}>`
  border-radius: ${props => (props.loading ? 0 : 6)}px;
  text-indent: ${props => (props.loading ? -9999 : 0)}px;
  background: ${props => (props.loading ? '#f5f5f5' : 'none')};
  border: 1px solid
    ${props => (props.loading ? '#f5f5f5' : 'rgb(223, 223, 223)')};
  cursor: ${props => (props.loading ? 'default' : 'pointer')};
  font-weight: 600;
  font-family: ProximaNova;
  height: 45px;
  transition: opacity 0.7s;
  letter-spacing: 0.22px;
  padding-left: 24px;
  padding-right: 24px;
  line-height: 1;
  font-size: 18px;
  color: #181818;
  text-transform: none;
  overflow: hidden;
  margin: 12px;
  width: 200px;
  &:hover {
    opacity: ${props => (props.loading ? 1 : 0.75)};
    background: ${props => (props.loading ? '#f5f5f5' : 'none')};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
  @media (max-width: 600px) {
    padding-left: 20px;
    padding-right: 20px;
    font-size: 15px;
    height: 38px;
  }
`;

export default StyledButton;
