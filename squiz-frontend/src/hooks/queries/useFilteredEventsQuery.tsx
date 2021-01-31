import { useCallback, useEffect, useState } from 'react';
import {
  Event,
  Filter,
  getEventById,
  getEventsByFilter
} from 'services/events';

const useFilteredEventsQuery = () => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const loadData = useCallback(
    (filter: Filter, offset: number, limit: number, reset?: boolean) => {
      if (reset === true) setLoading(true);

      getEventsByFilter(filter, offset, limit).then(res => {
        const data = res.map(r => {
          return r.item_summary.event_summary;
        });

        if (data.length === 0 || data.length < limit) setHasMore(false);
        else setHasMore(true);

        if (reset === true) {
          setEvents(data);
          setLoading(false);
        } else {
          setEvents(prevEvents => prevEvents.concat(data));
        }
      });
    },
    []
  );

  return { loading, events, hasMore, loadData };
};

export const useFilteredEventById = (id: string) => {
  const [event, setEvent] = useState<Event>();

  const handleSingleEvent = useCallback(async () => {
    const singleEvent = await getEventById(id);
    setEvent(singleEvent);

    return singleEvent;
  }, [id]);

  useEffect(() => {
    handleSingleEvent();
  }, [handleSingleEvent]);

  return event;
};

export default useFilteredEventsQuery;
