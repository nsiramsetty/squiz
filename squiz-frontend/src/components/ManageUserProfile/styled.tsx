import styled from '@emotion/styled';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import SectionTitle from 'components/SectionTitle';

export const StyledContainer = styled.div`
  text-align: center;
`;

export const StyledTitle = styled(SectionTitle)<{
  loading: number;
}>`
  height: ${props => (props.loading ? '40px' : 'auto')};
  width: ${props => (props.loading ? '300px' : 'auto')};
  text-indent: ${props => (props.loading ? -9999 : 0)}px;
  background: ${props => (props.loading ? '#f5f5f5' : 'none')};
  margin: ${props => (props.loading ? '0 auto 15px' : 0)};
  @media (max-width: 600px) {
    height: ${props => (props.loading ? '24px' : 'auto')};
    margin: ${props => (props.loading ? '0 auto 10px' : 0)};
  }
`;

export const StyledLocation = styled.p<{
  loading: number;
}>`
  height: ${props => (props.loading ? '18px' : 'auto')};
  width: ${props => (props.loading ? '200px' : 'auto')};
  text-indent: ${props => (props.loading ? -9999 : 0)}px;
  background: ${props => (props.loading ? '#f5f5f5' : 'none')};
  margin: 0 auto;
  font-size: 18px;
  font-weight: 300;
  color: #848484;
  line-height: 1;
  font-family: ProximaNova;
  @media (max-width: 600px) {
    font-size: 14px;
    height: ${props => (props.loading ? '14px' : 'auto')};
  }
`;

export const StyledAvatar = styled(Avatar)<{
  loading: number;
}>`
  margin: 0 auto;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-color: ${props => (props.loading ? '#f5f5f5' : '#cecece')};
  svg {
    display: ${props => (props.loading ? 'none' : 'block')};
  }
  @media (max-width: 600px) {
    width: 80px;
    height: 80px;
  }
`;

export const StyledButton = styled(Button)<{
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
