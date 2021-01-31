import { useCallback, useState } from 'react';

export function useQuery<T>(
  key: string | null | undefined,
  fetchFunction: (key: string) => Promise<T>
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      if (key != null) {
        setLoading(true);
        const response = await fetchFunction(key);
        if (response != null) {
          setData(response);
        }
        setLoading(false);
      }
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [setData, fetchFunction, key]);

  return {
    data,
    loading,
    error,
    loadData
  };
}

export default {
  useQuery
};
