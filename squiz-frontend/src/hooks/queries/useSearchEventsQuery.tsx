import useDebouncedCallback from 'hooks/useDebouncedCallback';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useState } from 'react';
import { Event, searchEvents } from 'services/events';

const useSearchEventsQuery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>();

  const resetData = () => {
    setSearchResults([]);
    setSearchQuery('');
    setIsLoading(false);
    setIsLoaded(false);
  };

  const handleSearchQuery = useCallback((query: string) => {
    if (isEmpty(query)) {
      resetData();
      return;
    }

    setIsLoading(true);

    searchEvents(query, 0, 10).then(res => {
      const data = res.map(r => {
        return r.item_summary.event_summary;
      });

      setSearchResults(data);
      setIsLoading(false);
      setIsLoaded(true);
    });
  }, []);

  const [debouncedFunction] = useDebouncedCallback(handleSearchQuery, 1000);

  const loadData = (query: string) => {
    setIsLoaded(false);
    setSearchQuery(query);
    debouncedFunction(query);
  };

  return {
    isLoading,
    isLoaded,
    searchResults,
    searchQuery,
    loadData,
    resetData
  };
};

export default useSearchEventsQuery;
