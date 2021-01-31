import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Event } from 'services/events';
import { getEventStartDateEpoch } from 'services/events/helpers';
import { getFeaturedLiveEvents } from 'services/featuredList';

const useLiveFeatured = (featuredList?: string, lang?: string) => {
  const [live, setLive] = useState<Event[]>([]);

  /*
   * Sorted live events by start date ASC
   */
  const getSortedLive = useCallback(() => {
    return live.sort(
      (a, b) => getEventStartDateEpoch(a) - getEventStartDateEpoch(b)
    );
  }, [live]);

  /**
   * Current live event
   */
  const getCurrentLive = useCallback(() => {
    const currentEpoch = moment().valueOf();
    const currentLive = getSortedLive().find(
      l => currentEpoch < getEventStartDateEpoch(l) + 3600000
    );

    return currentLive;
  }, [getSortedLive]);

  /**
   * Active live events
   * @param limit limit of return items
   */
  const getActiveLive = useCallback(
    (limit?: number) => {
      let activeLive: Event[] = [];
      const currentEpoch = moment().valueOf();

      activeLive = live.filter(
        l =>
          currentEpoch < getEventStartDateEpoch(l) + 3600000 &&
          !l._next_occurrences[0].has_ended
      );

      if (limit) activeLive = activeLive.slice(0, limit);

      return activeLive;
    },
    [live]
  );

  const handleLoadLive = useCallback(() => {
    getFeaturedLiveEvents(featuredList || 'live_stream_events', lang).then(
      res => {
        const featuredLiveEvents = res.map(r => r.event_summary);
        setLive(featuredLiveEvents);
      }
    );
  }, [featuredList, lang]);

  useEffect(() => {
    handleLoadLive();
  }, [handleLoadLive]);

  return { live, getCurrentLive, getActiveLive };
};

export default useLiveFeatured;
