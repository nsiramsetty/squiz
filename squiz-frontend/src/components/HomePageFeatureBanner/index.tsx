import StaggerWrapper from 'components/StaggerWrapper';
import SwiperCarousel from 'components/SwiperCarousel';
import { useFeaturedListQuery } from 'hooks/queries/useFeaturedListQuery';
import React from 'react';
import FeatureTile from './FeatureTile';
import { SlideContainer } from './styled';

interface Props {
  featuredList: string;
  lang?: string;
}

const HomePageFeatureBanner: React.FC<Props> = ({ featuredList, lang }) => {
  const featuredData = useFeaturedListQuery(featuredList, lang);

  if (featuredData.items.length === 0) return <></>;

  return (
    <SwiperCarousel
      overflow="visible"
      anchorClass="testing"
      spaceBetween={[13, 13, 13, 20]}
    >
      {featuredData.items.map((item, index) => (
        <SlideContainer key={item.library_item_summary?.id}>
          <StaggerWrapper
            staggerOn={index % 2 === 0}
            fadeInDelay={`${0.05 + index * 0.05}s`}
          >
            <FeatureTile
              id={item.library_item_summary?.id || ''}
              publisherId={item.library_item_summary?.publisher.id || ''}
              publisherName={item.library_item_summary?.publisher.name || ''}
              publisherUserName={
                item.library_item_summary?.publisher.username || ''
              }
              title={item.library_item_summary?.title || ''}
              slug={item.library_item_summary?.slug || ''}
              webUrl={`/${item.library_item_summary?.publisher.name}/guided-meditations/${item.library_item_summary?.slug}`}
            />
          </StaggerWrapper>
        </SlideContainer>
      ))}
    </SwiperCarousel>
  );
};

export default HomePageFeatureBanner;
