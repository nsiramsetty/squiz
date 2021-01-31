import { useCallback, useEffect, useState } from 'react';
import { FeaturedItem, getFeaturedList } from 'services/featuredList';

export interface FeaturedListQueryHook {
  name?: string;
  items: FeaturedItem[];
}

export const useFeaturedListQuery = (entryPoint: string, lang = 'en') => {
  const [name, setName] = useState<string>();
  const [items, setItems] = useState<FeaturedItem[]>([]);

  const handleLoadFeaturedList = useCallback(async () => {
    const data = await getFeaturedList(entryPoint, lang);
    setName(data.name);
    setItems(data.results);
  }, [lang, entryPoint]);

  useEffect(() => {
    handleLoadFeaturedList();
  }, [handleLoadFeaturedList]);

  return {
    name,
    items
  };
};
