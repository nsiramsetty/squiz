import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

export const StyledContainer = styled.div`
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
`;

export const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const StatsColumn = styled.div`
  width: 25%;
  padding: 0 15px;
  @media (max-width: 992px) {
    width: 50%;
    padding-top: 20px;
    padding-bottom: 20px;
  }
`;

export const StatsValue = styled.div<{
  loading: number;
}>`
  text-indent: ${props => (props.loading ? -9999 : 0)}px;
  background: ${props => (props.loading ? '#f5f5f5' : 'none')};
  height: ${props => (props.loading ? '120px' : 'auto')};
  width: ${props => (props.loading ? 'calc(100% - 30px)' : 'auto')};
  margin: 0 auto;
  font-family: ProximaNova;
  font-size: 75px;
  line-height: 1;
  font-weight: 300;
  @media (max-width: 600px) {
    font-size: 50px;
    height: ${props => (props.loading ? '85px' : 'auto')};
  }
`;

export const StatsLabel = styled.div<{
  loading: number;
}>`
  display: ${props => (props.loading ? 'none' : 'block')};
  margin: 0 auto;
  font-family: ProximaNova;
  font-size: 20px;
  line-height: 1.1;
  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

export const StyledButton = styled(Button)<{
  loading: number;
  active?: number;
}>`
  border-radius: ${props => (props.loading ? 0 : 6)}px;
  text-indent: ${props => (props.loading ? -9999 : 0)}px;
  background: ${props =>
    props.loading || props.active ? '#f5f5f5' : '#181818'};
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
  color: ${props => (props.active ? '#181818' : '#fff')};
  text-transform: none;
  width: 250px;
  margin: 12px;
  &:hover {
    opacity: ${props => (props.loading ? 1 : 0.75)};
    background: ${props =>
      props.loading || props.active ? '#f5f5f5' : '#181818'};
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
