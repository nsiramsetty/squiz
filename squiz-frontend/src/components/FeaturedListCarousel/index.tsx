import CarouselContainer from 'components/CarouselContainer/v2';
import LiveFeatureBanner from 'components/LiveFeatureBanner';
import React from 'react';
import { useParams } from 'react-router';

interface PathParams {
  id: string;
}
const FeaturedListCarousel: React.FC = () => {
  const { id } = useParams<PathParams>();
  return (
    <CarouselContainer>
      <LiveFeatureBanner featured={id} />
    </CarouselContainer>
  );
};

export default FeaturedListCarousel;
