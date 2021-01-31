import styled from '@emotion/styled';

export const ReviewContainer = styled.div`
  font-family: ProximaNova;
  background-color: #f4f4f4;
  border-radius: 0.75rem;
  padding: 20px;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
`;

export const ReviewHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

export const ReviewAuthorAvatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 20px;
`;

export const ReviewHeaderMiddle = styled.div`
  line-height: 1;
  font-family: ProximaNova;
  margin-left: 12px;
  flex: 1;
`;

export const ReviewAuthorName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgb(0, 0, 0, 0.87);
`;

export const ReviewDate = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #7b7b7b;
`;

export const ReviewMessage = styled.div`
  margin-top: 16px;
  letter-spacing: 0.4px;
  color: #1c1c1c;
  line-height: 1.625;
  font-size: 16px;
  font-weight: 500;
`;
