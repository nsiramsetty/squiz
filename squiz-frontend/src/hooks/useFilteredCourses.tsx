/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { ApiResponse } from 'services/interface';
import { LibraryItemApi } from 'services/libraryItem/api';
import {
  Filter,
  LibraryItem,
  TSortOption
} from 'services/libraryItem/interface';

const libraryItemApi = new LibraryItemApi();

export const useFilteredCourses = (
  filterObj: Filter = { deviceLang: 'en' },
  sortOption: TSortOption = 'popular',
  limit: number = 5,
  from: number = 0,
  topic?: string
): ApiResponse<LibraryItem> => {
  const [coursesData, setCoursesData] = useState<ApiResponse<LibraryItem>>({
    data: [],
    total_count: 0
  });

  const handleLoadData = useCallback(() => {
    libraryItemApi
      .getCoursesByFilter(filterObj, sortOption, limit, from, undefined, topic)
      .then(resp => {
        setCoursesData(resp);
      });
  }, [filterObj, limit, from]);

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  return { total_count: coursesData.total_count, data: coursesData.data };
};
