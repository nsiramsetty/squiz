import styled from '@emotion/styled';

export const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const HostContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HostLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const HostRight = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 1000px;
  border: solid 0.5px rgba(0, 0, 0, 0.05);
`;

export const Administrator = styled.div`
  width: auto;
  height: 15px;
  border-radius: 2px;
  background-color: #222222;
  font-family: ProximaNova;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.3px;
  color: #ffffff;
  text-transform: uppercase;
  text-align: center;
  padding: 0px 5px;
`;

export const HostName = styled.div`
  font-family: ProximaNova;
  font-size: 18px;
  font-weight: 800;
  line-height: 20px;
  letter-spacing: normal;
  color: #222222;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

export const MembersCount = styled.div`
  line-height: 20px;
  font-family: ProximaNova;
  font-size: 16px;
  letter-spacing: normal;
  color: #5a5a5a;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const StyledAvatarGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

export const MemberContainer = styled.div<{
  endOfRow?: boolean;
}>`
  @media (max-width: 600px) {
    margin-bottom: 20px;
    margin-right: ${props => (props.endOfRow ? '0px' : '20px')};
    width: calc((100% - 60px) / 4);
    height: auto;
  }
  margin-bottom: 30px;
  margin-right: ${props => (props.endOfRow ? '0px' : '30px')};
  width: calc((100% - 120px) / 5);
  height: auto;
`;
