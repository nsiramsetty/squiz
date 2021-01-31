import CarouselContainer from 'components/CarouselContainer';
import React from 'react';
import HomePageFeatureBanner from '.';

export const Normal = () => {
  return (
    <CarouselContainer>
      <HomePageFeatureBanner featuredList="web_home_page_banner" />
    </CarouselContainer>
  );
};

export default { title: 'HomePageFeaturedBanner' };
