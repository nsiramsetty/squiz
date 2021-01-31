import { ReactComponent as ParentsSVG } from 'assets_2/icons/kids/parents.svg';
import StaggerWrapper from 'components/StaggerWrapper';
import SwiperCarousel from 'components/SwiperCarousel';
import TileButton from 'components/TileButton';
import React, { useEffect, useState } from 'react';
import { LibraryItemApi } from 'services/libraryItem/api';
import { kitKeys, kits } from './kitData';
import {
  ButtonContent,
  FreeTitlesCount,
  KitActionText,
  KitTitleText,
  SlideContainer
} from './styled';

const libraryItemApi = new LibraryItemApi();

const HomePageKitBanner: React.FC<{}> = () => {
  const [counts, setCounts] = useState<number[]>();

  useEffect(() => {
    Promise.all(
      kitKeys.map(key =>
        libraryItemApi
          .headLibraryItemsByFilter({}, 'most_played', 10, 0, key)
          .then(res => res.total_count)
      )
    ).then(res => setCounts(res));
  }, []);

  return (
    <SwiperCarousel
      overflow="visible"
      anchorClass="test"
      spaceBetween={[13, 13, 13, 20]}
    >
      {kits.map((kit, index) => (
        <SlideContainer key={kitKeys[index]}>
          <StaggerWrapper
            staggerOn={index % 2 === 0}
            fadeInDelay={`${0.05 + index * 0.05}s`}
          >
            <TileButton
              bgImage={kit.background_image}
              bgImageMobile={kit.background_image_mobile}
              to={`/meditation-topics/${kitKeys[index]}`}
              paddingtop={['100%', '178%']}
            >
              <ButtonContent>
                <KitActionText>{kit.title_top}</KitActionText>
                {index === 4 ? (
                  <ParentsSVG fill="#FFF" width="170px" />
                ) : (
                  <KitTitleText>{kit.title_bottom}</KitTitleText>
                )}
                <FreeTitlesCount>
                  {counts &&
                    (counts[index] > 1000
                      ? `${(counts[index] / 1000).toFixed(1)}k `
                      : `${counts[index]} `)}
                  free titles
                </FreeTitlesCount>
              </ButtonContent>
            </TileButton>
          </StaggerWrapper>
        </SlideContainer>
      ))}
    </SwiperCarousel>
  );
};

export default HomePageKitBanner;
