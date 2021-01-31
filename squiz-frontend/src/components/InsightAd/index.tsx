import DawnImage from 'assets_2/images/circles/dawn.jpg';
import BowlLogo from 'assets_2/images/logo/bowl-dark.svg';
import TextLogo from 'assets_2/images/logo/text-logo.svg';
import VerticalSpacing from 'components/VerticalSpacing';
import React from 'react';
import {
  Container,
  ContentOnImage,
  FreeText,
  Heading,
  LearnMore,
  StyledBowlLogo,
  StyledImage,
  StyledLogo,
  StyledTextLogo
} from './styled';

const InsightAd: React.FC = () => {
  return (
    <Container>
      <StyledImage src={DawnImage} />
      <ContentOnImage>
        <StyledLogo>
          <StyledBowlLogo src={BowlLogo} alt="InsightTimer-bowl-logo" />
          <StyledTextLogo src={TextLogo} alt="InsightTimer-text-logo" />
        </StyledLogo>
        <VerticalSpacing height={30} />
        <Heading>
          #1 <FreeText fill="#fff" /> app for sleep, anxiety and stress.
        </Heading>
        <VerticalSpacing height={18} />
        <LearnMore href="/">Learn more</LearnMore>
      </ContentOnImage>
    </Container>
  );
};

export default InsightAd;
