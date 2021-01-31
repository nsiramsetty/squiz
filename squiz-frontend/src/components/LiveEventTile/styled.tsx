import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';

export const TileItemContainer = styled.div<{
  paddingTop?: string;
}>`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 8px;
  transition: 0.4s;
  height: 100%;
  width: 100%;
  padding-top: ${props => (props.paddingTop ? props.paddingTop : `100%`)};
  border-radius: 6px;
  position: relative;
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  top: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const StyledOverlay = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 55%,
    rgba(0, 0, 0, 0.4) 100%
  );
`;

export const ScheduledTime = styled.div<{
  live?: boolean;
}>`
  position: absolute;
  left: 8px;
  bottom: 8px;
  height: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.4);
  background-color: ${props => (props.live ? '#b90c4e' : '#ffffff')};
  font-family: ProximaNova;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.12px;
  color: ${props => (props.live ? '#ffffff' : '#222222')};
  padding: 2px 7px 1px 7px;
  text-transform: uppercase;
`;

export const EventOwner = styled.div`
  font-family: ProximaNova;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: -0.09px;
  color: #5a5a5a;
`;

export const EventTitle = styled.div`
  font-family: ProximaNova;
  font-size: 17px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: -0.09px;
  color: #222222;
`;

export const Attendees = styled.div`
  font-family: ProximaNova;
  font-size: 15px;
  white-space: nowrap;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: -0.09px;
  color: #5a5a5a;
`;

export const JoinButton = styled(Button)<{
  bgcolor: string;
  textcolor: string;
}>`
  font-family: ProximaNova;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.47;
  letter-spacing: normal;
  color: ${props => (props.textcolor ? props.textcolor : '#fff')};
  border-radius: 4px;
  background-color: ${props => (props.bgcolor ? props.bgcolor : '#222222')};
  width: 90px;
  height: 34px;
  :hover {
    background-color: #a20843;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 100px);
`;

export const Right = styled.div``;

export const LiveLink = styled.a``;

export const AttendeesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
