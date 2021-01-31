import Axios from 'axios';
import { HOST_URL } from 'Config/constants';
import { LooseObject } from 'lib/models';
import get from 'lodash/get';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { convertFeaturedList } from 'services/libraryItem/api';
import { LibraryItem } from 'services/libraryItem/interface';
import { convertFeaturedPublishers } from 'services/publisher/api';
import { Publisher } from 'services/publisher/interface';

type FeaturedList = {
  items: LooseObject[];
  name: string;
};

export type FeaturedListHook = {
  name: string;
  libraryItems: LibraryItem[];
  publishers: Publisher[];
};

export const useFeaturedList = (
  entryPoint?: string,
  lang: string = 'en'
): FeaturedListHook => {
  const [rawData, setRawData] = useState<FeaturedList>({
    items: [],
    name: ''
  });

  const publishers = useMemo(() => {
    return (
      (rawData.items &&
        rawData.items
          .filter(obj => get(obj, 'featured_list_item_type') === 'USERS')
          .map(obj => convertFeaturedPublishers(obj))) ||
      []
    );
  }, [rawData]);

  const libraryItems = useMemo(() => {
    return (
      (rawData.items &&
        rawData.items
          .filter(
            obj => get(obj, 'featured_list_item_type') === 'LIBRARY_ITEMS'
          )
          .map(obj => convertFeaturedList(obj, true))) ||
      []
    );
  }, [rawData]);

  const handleLoadRawData = useCallback(() => {
    Axios.get(
      `${HOST_URL}/apiAsFrontEndFeaturedList/v2/request/summary?${`entry_point=${entryPoint}`}&device_lang=${lang ||
        'en'}&content_langs=${lang || 'en'}`
    ).then(res => {
      setRawData(res.data);
    });
  }, [lang, entryPoint]);

  useEffect(() => {
    handleLoadRawData();
  }, [handleLoadRawData]);

  return { name: rawData.name, libraryItems, publishers };
};
