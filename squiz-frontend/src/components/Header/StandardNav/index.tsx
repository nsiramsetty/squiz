import styled from '@emotion/styled';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useHeader } from 'hooks/useHeader';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import {
  InteractionLocations,
  LinkClickedEventNames
} from 'lib/mparticle/enums';
import { logClicked } from 'lib/mparticle/loggers';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

const StyledNav = styled(NavLink)<{
  color: string;
  hover: string;
}>`
  font-family: ProximaNova;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: 0.27px;
  display: flex;
  align-items: center;
  padding: 6px 24px;
  font-weight: 600;
  color: ${props => props.color};
  font-size: 20px;

  &:hover {
    color: ${props => props.hover};
  }
`;

interface TProps {
  to: string;
  active?: boolean;
  interactionLocation?: InteractionLocations;
  onClick?: () => void;
}

const StandardNav: React.FC<TProps & RouteComponentProps> = ({
  to,
  location,
  children,
  active,
  interactionLocation,
  onClick
}) => {
  const { pageType } = usePageViewTracker();
  const { transparentHeader } = useHeader();
  const i18n = useLinguiI18n();

  const isActive = location.pathname === to || active;

  const getColor = () => {
    if (transparentHeader && isActive) return '#ffffff';
    if (transparentHeader) return 'rgba(255,255,255,0.6)';
    if (isActive) return '#181818';
    return '#999999';
  };

  const getHoverColor = () => {
    if (transparentHeader) return '#ffffff';
    return '#181818';
  };

  return (
    <StyledNav
      to={to}
      color={getColor()}
      hover={getHoverColor()}
      onClick={e => {
        if (onClick != null) onClick();
        logClicked(
          LinkClickedEventNames.NavigationLink,
          pageType,
          (e.target as HTMLElement).innerText,
          interactionLocation,
          {
            to,
            lang: i18n.language
          }
        );
      }}
    >
      {children}
    </StyledNav>
  );
};

export default withRouter(StandardNav);
