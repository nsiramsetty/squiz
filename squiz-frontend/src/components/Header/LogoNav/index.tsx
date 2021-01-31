import TextLogoWhite from 'assets_2/images/logo/insighttimer-white.svg';
import TextLogo from 'assets_2/images/logo/insighttimer.svg';
import { useHeader } from 'hooks/useHeader';
import { useTaxonomy } from 'hooks/useTaxonomy';
import React from 'react';
import { StyledLogoNav, StyledTextLogo } from './styled';

interface Props {
  darkLogo?: boolean;
}

const LogoNav = ({ darkLogo }: Props) => {
  const taxonomy = useTaxonomy();
  const { transparentHeader } = useHeader();

  return (
    <StyledLogoNav to={taxonomy.getHomeUrl()}>
      <StyledTextLogo
        src={transparentHeader && !darkLogo ? TextLogoWhite : TextLogo}
        alt="Insight Timer logo"
      />
    </StyledLogoNav>
  );
};

export default LogoNav;
