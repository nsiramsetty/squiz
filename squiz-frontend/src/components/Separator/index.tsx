import styled from '@emotion/styled';
import React from 'react';

const SeparatorContainer = styled.div<{ padding: [number, number] }>`
  display: flex;
  align-items: center;
  flex: none;
  -webkit-box-flex: 0;
  width: 100%;
  padding: ${props => `${props.padding[1]}px 0`};
  @media (max-width: 600px) {
    padding: ${props => `${props.padding[0]}px 0`};
  }
`;
const SeparatorLine = styled.hr`
  -webkit-box-flex: 1;
  flex: 1 1 0%;
  border-color: #ebebeb !important;
`;
const MiddleOr = styled.div`
  margin-left: 11px;
  margin-right: 11px;
  line-height: 18px;
  font-family: ProximaNova;
  font-size: 15px;
  font-weight: normal;
  letter-spacing: 0.19px;
  color: rgba(72, 72, 72, 0.7);
`;

const Separator: React.FC<{ padding?: [number, number] }> = ({
  children,
  padding
}) => {
  return (
    <SeparatorContainer padding={padding || [0, 0]}>
      <SeparatorLine />
      {children && (
        <>
          <MiddleOr>{children}</MiddleOr>
          <SeparatorLine />
        </>
      )}
    </SeparatorContainer>
  );
};

export default Separator;
