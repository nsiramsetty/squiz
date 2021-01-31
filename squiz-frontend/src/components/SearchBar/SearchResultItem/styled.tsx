import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
  padding: 4px;
  display: flex;
  align-items: center;
  :hover {
    background: #f4f4f4;
  }
  :first-of-type {
    margin-top: 8px;
  }
  :last-of-type {
    margin-bottom: 8px;
  }
`;

export const StyledLeft = styled.div`
  width: 40px;
  display: flex;
  margin-left: 4px;
  justify-content: start;
`;

export const StyledRight = styled.div`
  width: calc(100% - 40px);
  padding: 0 12px;
`;

export const StyledAvatar = styled.div<{
  image?: string;
  fullrounded?: number;
}>`
  width: 40px;
  height: 40px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  background-image: ${props =>
    props.image ? `url(${props.image})` : 'transparent'};
  border-radius: ${props => (props.fullrounded ? '50%' : '4px')};
`;

export const StyledTitle = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: ProximaNova;
  font-size: 16px;
  color: #22292f;
  font-weight: 700;
`;

export const StyledDescription = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: ProximaNova;
  color: #7d8084;
  font-size: 12px;
`;

export const StyledDot = styled.span`
  height: 4px;
  width: 4px;
  background-color: #999;
  border-radius: 50%;
  display: inline-block;
  margin: 0px 5px 3px 5px;
  position: relative;
  top: 1px;
`;

export const StyledContentType = styled.span`
  text-transform: uppercase;
`;
