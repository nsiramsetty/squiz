/* eslint-disable react-hooks/exhaustive-deps */
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { HeaderBackground } from 'components/Header/styled';
import { useScrollPosition } from 'hooks/useScrollPosition';
import React, { useEffect } from 'react';
import Desktop from './desktop';
import Mobile from './mobile';

interface TProps {
  hideShadow?: boolean;
  onScrolled?: () => void;
}

const Header: React.FC<TProps> = ({ hideShadow, onScrolled }) => {
  const { scroll80 } = useScrollPosition();

  const mobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), {
    noSsr: true
  });

  useEffect(() => {
    if (onScrolled) onScrolled();
  }, [scroll80]);

  return (
    <HeaderBackground scrolled={scroll80} shadow={!hideShadow}>
      {mobile ? <Mobile /> : <Desktop />}
    </HeaderBackground>
  );
};

export default Header;
