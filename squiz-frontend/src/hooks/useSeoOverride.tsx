import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export interface SeoOverride {
  url_path: string;
  h1: string;
  description: string;
  meta_title: string;
  meta_description: string;
  updated_at: Date;
}

export const useSeoOverride = (urlPath?: string) => {
  const [loading, setLoading] = useState(true);
  const [seoOverride, setSeoOverrideDetails] = useState<SeoOverride>();

  const loadUseSeoOverride = async (path?: string) => {
    if (!path) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const newURLPath = path.split('/').join('__');
    await Axios.get(
      `https://sitemap.insighttimer.com/overrides/${newURLPath}.json`
    )
      .then(resp => {
        setSeoOverrideDetails(resp.data);
      })
      .catch(err => {
        setSeoOverrideDetails(undefined);
      });
    setLoading(false);
  };

  const handleSeoOverride = useCallback(loadUseSeoOverride, []);

  useEffect(() => {
    setLoading(true);
    handleSeoOverride(urlPath);
  }, [handleSeoOverride, urlPath]);

  return { loading, seoOverride };
};
