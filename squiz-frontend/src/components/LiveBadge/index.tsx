import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { ReactComponent as TinyCameraSvg } from 'assets_2/icons/circle/camera-icon.svg';
import React from 'react';

const LiveBadgeStyled = styled.div<{
  live?: boolean;
}>`
  width: 92px;
  border-radius: ${props => (props.live ? '6px 0px' : '10px 0px')};
  background-color: ${props => (props.live ? '#b90c4e' : '#ffffff')};
  color: ${props => (props.live ? '#ffffff' : '#b90c4e')};
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.2px;
  font-family: ProximaNova;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type LiveBadgeProps = {
  live?: boolean;
  className?: string;
};

const LiveBadge: React.FC<LiveBadgeProps> = ({ live, className }) => {
  return (
    <LiveBadgeStyled live={live} className={className}>
      <Trans>LIVE EVENT</Trans>
      <TinyCameraSvg fill={live ? '#ffffff' : '#b90c4e'} className="ml-1" />
    </LiveBadgeStyled>
  );
};

export default LiveBadge;
