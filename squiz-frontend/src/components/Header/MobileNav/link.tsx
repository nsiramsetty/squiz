import { usePageViewTracker } from 'context/PageViewTracker';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import {
  InteractionLocations,
  LinkClickedEventNames
} from 'lib/mparticle/enums';
import { logClicked } from 'lib/mparticle/loggers';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { StyledNav } from './styled';

interface TProps {
  to: string;
  small?: boolean;
  active?: boolean;
  interactionLocation?: InteractionLocations;
  onClick?: () => void;
}

const MobileLink: React.FC<TProps & RouteComponentProps> = ({
  to,
  location,
  children,
  small,
  active,
  interactionLocation,
  onClick
}) => {
  const { pageType } = usePageViewTracker();
  const i18n = useLinguiI18n();
  const isActive = location.pathname === to || active;

  const getColor = () => {
    if (isActive) return '#181818';
    return '#999999';
  };

  return (
    <StyledNav
      to={to}
      color={getColor()}
      small={small ? 1 : 0}
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

export default withRouter(MobileLink);
