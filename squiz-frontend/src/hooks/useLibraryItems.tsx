/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { getFilteredLibraryItems } from 'services/filtering';
import {
  TLengthRange,
  TSortOption,
  TTypeOption,
  TVoiceOption
} from 'services/libraryItem/interface';

export const useLibraryItems = (
  sortOption: TSortOption,
  lengthOption: TLengthRange,
  voiceOption: TVoiceOption,
  page: number = 0, // current page
  pageSize: number,
  deviceLang?: string,
  contentLangs?: string,
  type?: TTypeOption,
  topic?: string
) => {
  const loadLibraryItems = useCallback(
    offset => {
      return getFilteredLibraryItems({
        voice_gender: voiceOption,
        length_range: lengthOption,
        device_lang: deviceLang,
        content_langs: contentLangs?.split(','),
        content_types:
          (type && [type]) ||
          (deviceLang !== 'en' ? ['guided', 'talks'] : undefined),
        topics: (topic && [topic]) || undefined,
        sort_option: sortOption,
        size: pageSize,
        offset: pageSize * page + offset
      });
    },
    [
      sortOption,
      lengthOption,
      voiceOption,
      page,
      deviceLang,
      contentLangs,
      type,
      topic
    ]
  );

  return loadLibraryItems;
};

export default useLibraryItems;
