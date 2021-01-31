import SwiperCarousel from 'components/SwiperCarousel';
import React, { ReactNode, useState } from 'react';
import VizSensor from 'react-visibility-sensor';

type TProps = {
  children: (inView: boolean) => ReactNode;
  centerNavButtons?: boolean;
};

const TileCarousel: React.FC<TProps> = ({ children, centerNavButtons }) => {
  const [inView, setInView] = useState<boolean>(false);

  return (
    <VizSensor
      partialVisibility
      active={!inView}
      onChange={(isVisible: boolean) => {
        if (!inView) {
          setInView(isVisible);
        }
      }}
    >
      <SwiperCarousel
        anchorClass={!centerNavButtons ? 'tile_background_image' : undefined}
        spaceBetween={[10, 24, 24, 24]}
      >
        {children(inView)}
      </SwiperCarousel>
    </VizSensor>
  );
};

export default TileCarousel;
