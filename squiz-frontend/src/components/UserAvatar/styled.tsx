import styled from '@emotion/styled';
import Avatar from '@material-ui/core/Avatar';

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const DefaultAvatar = styled.div<{
  bgColor?: string;
  fontSize?: string;
}>`
  width: 100%;
  height: 100%;
  background: ${props =>
    props.bgColor || 'linear-gradient(to top, #61cbf1, #3982f7)'};
  font-size: ${props => props.fontSize || '27px'};
  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const StyledAvatar = styled(Avatar)`
  width: 100%;
  height: 100%;
  font-family: ProximaNova;
  letter-spacing: -0.3px;
  color: #ffffff;
  font-weight: 600;
  position: relative;
`;

export const StyledNumberAvatar = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 100px;
  background-color: #f5f5f5;
  letter-spacing: normal;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100%;
`;

export const StyledText = styled.div`
  color: #9a9a9a;
  font-family: ProximaNova;
  font-size: 16px;
  font-weight: 600;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
`;

export const Badge = styled.div`
  width: auto;
  height: 18px;
  border-radius: 12px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  color: #191919;
  line-height: 18px;
  font-size: 10px;
  font-family: ProximaNova;
  font-weight: 800;
  text-align: center;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0px 5px;
`;
