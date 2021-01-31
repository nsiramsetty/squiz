import styled from '@emotion/styled';
import FlatEarth from 'components/ActiveGlobe/flatEarth';
import LocalCities from 'components/LocalCities';
import PageMeta from 'components/PageMeta';
import SectionContainer from 'components/SectionContainer';
import VerticalSpacing from 'components/VerticalSpacing';
import Footer from 'components_2/footer';
import { usePageViewTracker } from 'context/PageViewTracker';
import useLocals from 'hooks/useLocals';
import { PageTypes } from 'lib/mparticle/enums';
import React, { useEffect } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { PageDescription, Title, TitleSection } from './styles';

const StyledDiv = styled.div`
  margin-top: -240px;
  @media (max-width: 1280px) {
    margin-top: -160px;
  }
  @media (max-width: 600px) {
    margin-top: -20px;
  }
`;

const Local = () => {
  const { getCities } = useLocals();
  const cities = getCities();

  const { trackPageView } = usePageViewTracker();

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.LocalBrowse
    });
  }, [trackPageView]);

  const title = 'Meditate with others near you';
  const description =
    'Thousands of people near you are meditating now with Insight Timer. Erase anxiety, embrace calmness and fall asleep easier with the world’s most popular meditation app.';

  return (
    <>
      <PageMeta
        title={title}
        description={description}
        url="https://insighttimer.com/local"
      />

      <SectionContainer>
        <TitleSection>
          <Title>
            <FormattedHTMLMessage id="local-title" defaultMessage={title} />
          </Title>
          <PageDescription>{description}</PageDescription>
        </TitleSection>
      </SectionContainer>

      <SectionContainer>
        <FlatEarth />
      </SectionContainer>

      <StyledDiv>
        <SectionContainer variant="small">
          <LocalCities cities={cities} />
        </SectionContainer>
      </StyledDiv>

      <VerticalSpacing height={100} />
      <Footer />
    </>
  );
};

export default Local;
