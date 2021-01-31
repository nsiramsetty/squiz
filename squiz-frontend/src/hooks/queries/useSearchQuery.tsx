import { LooseObject } from 'lib/models';
import { useCallback, useState } from 'react';
import { singleTrackSearch, topSearch } from 'services/search';

export function useSearchQuery() {
  const [searchResults, setSearchResults] = useState<LooseObject[] | null>();
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(
    async (query: string, limit: number, from: number, deviceLang: string) => {
      if (query != null) {
        setLoading(true);
        try {
          const data = await topSearch(query, limit, from, deviceLang);
          if (data.length) {
            setSearchResults(data);
          } else {
            setSearchResults(null);
          }
          setLoading(false);
        } catch (error) {
          setSearchResults(null);
          setLoading(false);
        }
      }
    },
    [setSearchResults]
  );

  const loadSingleTrackData = useCallback(
    async (
      query: string,
      limit: number,
      from: number = 0,
      deviceLang: string = 'en'
    ) => {
      if (query != null) {
        setLoading(true);
        try {
          const data = await singleTrackSearch(query, limit, from, deviceLang);
          setLoading(false);
          return data;
        } catch (error) {
          setLoading(false);
          return [];
        }
      }
    },
    []
  );

  return {
    searchResults,
    loading,
    loadData,
    loadSingleTrackData
  };
}

export default {
  useSearchQuery
};
