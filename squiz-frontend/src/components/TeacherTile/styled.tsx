import styled from '@emotion/styled';

export const TileContainer = styled.div`
  transition: 0.4s;
  width: 100%;
  padding-top: 149%;
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

export const StyledOverlay = styled.div<{
  load?: boolean;
}>`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  background: ${props =>
    props.load
      ? 'linear-gradient(0deg, rgba(24,24,24,0.8) 0%, rgba(0,0,0,0) 40%)'
      : 'rgba(0,0,0,0.1)'};
`;

export const StyledContents = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  left: 0;
  top: 0;
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-end;
  justify-items: center;
`;

export const NewLabel = styled.div`
  background-color: #71b925;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 0;
  font-family: ProximaNova;
  margin: 7px;
  padding: 0px 10px;
  text-align: center;
  border-radius: 15px;
  color: #fff;
`;

export const StyledLabel = styled.div`
  width: 100%;
  -webkit-font-smoothing: antialiased;
  font-family: JennaSue;
  font-weight: normal;
  font-size: 28px;
  line-height: 24px;
  text-align: center;
  color: #fff;
`;

export const StyledTeacherName = styled.div`
  width: 100%;
  font-family: ProximaNova;
  font-size: 20px;
  letter-spacing: 0.24px;
  line-height: 24px;
  font-weight: 700;
  font-weight: bold;
  overflow: hidden;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export const StyledTeacherLocation = styled.div`
  width: 100%;
  font-family: ProximaNova;
  font-size: 12px;
  line-height: 18px;
  height: 18px;
  letter-spacing: 0.2px;
  font-weight: bold;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
`;
