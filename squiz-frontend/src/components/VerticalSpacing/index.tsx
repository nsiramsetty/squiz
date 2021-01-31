import styled from '@emotion/styled';
import React from 'react';

interface Props {
  height: [number, number, number, number] | [number, number] | number;
}

const VerticalSpacing4 = styled.div<{
  height: [number, number, number, number];
}>`
  height: ${({ height }) => `${height[3]}px`};
  @media (max-width: 1280px) {
    height: ${({ height }) => `${height[2]}px`};
  }
  @media (max-width: 960px) {
    height: ${({ height }) => `${height[1]}px`};
  }
  @media (max-width: 600px) {
    height: ${({ height }) => `${height[0]}px`};
  }
`;

const VerticalSpacing2 = styled.div<{
  height: [number, number];
}>`
  height: ${({ height }) => `${height[1]}px`};
  @media (max-width: 600px) {
    height: ${({ height }) => `${height[0]}px`};
  }
`;

const VerticalSpacing1 = styled.div<{
  height: number;
}>`
  height: ${({ height }) => `${height}px`};
`;

const VerticalSpacing: React.FC<Props> = ({ height }) => {
  if (Array.isArray(height)) {
    if (height.length === 4) {
      return <VerticalSpacing4 height={height} />;
    }
    return <VerticalSpacing2 height={height} />;
  }
  return <VerticalSpacing1 height={height} />;
};

export default VerticalSpacing;
