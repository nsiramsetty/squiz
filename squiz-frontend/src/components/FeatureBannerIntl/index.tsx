import FeatureLiveTile from 'components/HomePageFeatureBanner/FeatureLiveTile';
import FeatureTile from 'components/HomePageFeatureBanner/FeatureTile';
import { SlideContainer } from 'components/HomePageFeatureBanner/styled';
import StaggerWrapper from 'components/StaggerWrapper';
import SwiperCarousel from 'components/SwiperCarousel';
import { useFeaturedListQuery } from 'hooks/queries/useFeaturedListQuery';
import useLiveFeatured from 'hooks/useLiveFeatured';
import get from 'lodash/get';
import moment from 'moment';
import React from 'react';
import { isActive } from 'services/events/helpers';
import { FeaturedItem } from 'services/featuredList';
import { useFilteredEventById } from '../../hooks/queries/useFilteredEventsQuery';
import { Event } from '../../services/events';

interface Props {
  featuredList: string;
  lang?: string;
}

const FeatureBannerIntl: React.FC<Props> = ({ featuredList, lang }) => {
  const featuredData = useFeaturedListQuery(featuredList, lang);
  const featuredActiveLive = useLiveFeatured('', lang).getActiveLive();
  const giseleLiveEvent = useFilteredEventById(
    '2c8777b0-1f40-4be0-8422-ac00bfab76f6'
  ) as Event;

  const featuredLive: Event | undefined = featuredActiveLive
    .filter(liveEvent => get(liveEvent, 'lang.iso_639_1') === lang)
    .filter(liveEvent => {
      const startsAt = get(liveEvent, '_next_occurrences[0].start_date.epoch');
      if (startsAt && moment(startsAt).isBefore(moment().add(7, 'day')))
        return true;
      return false;
    })
    .shift();

  const featured: (Event | FeaturedItem)[] = featuredData.items;

  if (featured == null) return <></>;

  // replace featured live with hardcoded gisele event.
  if (giseleLiveEvent != null && isActive(giseleLiveEvent)) {
    featured[0] = giseleLiveEvent;
  } else if (featuredLive) {
    featured[0] = featuredLive;
  }

  return (
    <SwiperCarousel
      overflow="visible"
      anchorClass="testing"
      spaceBetween={[13, 13, 13, 20]}
    >
      {featured?.map((feature, index) => {
        const item = feature as FeaturedItem;

        if (item.featured_list_item_type !== undefined) {
          return (
            <SlideContainer key={item.library_item_summary?.id}>
              <StaggerWrapper
                staggerOn={index % 2 === 0}
                fadeInDelay={`${0.05 + index * 0.05}s`}
              >
                <FeatureTile
                  id={item.library_item_summary?.id || ''}
                  publisherId={item.library_item_summary?.publisher.id || ''}
                  publisherName={
                    item.library_item_summary?.publisher.name || ''
                  }
                  publisherUserName={
                    item.library_item_summary?.publisher.username || ''
                  }
                  title={item.library_item_summary?.title || ''}
                  slug={item.library_item_summary?.slug || ''}
                  webUrl={`/${item.library_item_summary?.publisher.name}/guided-meditations/${item.library_item_summary?.slug}`}
                />
              </StaggerWrapper>
            </SlideContainer>
          );
        }
        const liveEvent = feature as Event;
        return (
          <SlideContainer>
            <StaggerWrapper
              staggerOn={index % 2 === 0}
              fadeInDelay={`${0.05 + index * 0.05}s`}
            >
              <FeatureLiveTile {...liveEvent} />
            </StaggerWrapper>
          </SlideContainer>
        );
      })}
    </SwiperCarousel>
  );
};

export default FeatureBannerIntl;
