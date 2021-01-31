import featureListApi, { FeaturedData } from 'lib/featured';
import { useCallback, useEffect, useState } from 'react';

const useHomeFeatured = (featuredList: string, lang?: string) => {
  const [data, setData] = useState<FeaturedData[]>([]);

  async function loadHomeFeaturedList() {
    featureListApi.getHomePage(featuredList, lang).then(res => {
      setData(res);
    });
  }

  const handleLoadFeatured = useCallback(loadHomeFeaturedList, [featuredList]);

  useEffect(() => {
    handleLoadFeatured();
  }, [handleLoadFeatured]);

  return data;
};

export default useHomeFeatured;
