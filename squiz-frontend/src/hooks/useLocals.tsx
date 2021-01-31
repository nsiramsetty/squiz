import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface LooseObject {
  [key: string]: any;
}

export interface TCity {
  lat: number;
  lon: number;
  name: string;
  slug: string;
  userCount: number;
  teacherCount: number;
}

export interface TLocal {
  name: string;
  slug: string;
  isoCode: string;
  cities: TCity[];
}

export const convertLocal = (data: [string, any]) => {
  const convert: TLocal = {
    name: data[1]?.name,
    slug: data[1]?.slug,
    isoCode: data[0],
    cities: data[1]?.cities
  };
  return convert;
};

const useLocals = () => {
  const [loading, setLoading] = useState(true);
  const [locals, setLocals] = useState<TLocal[]>();

  const getCities = useCallback(() => {
    if (locals) {
      const cities = locals.flatMap(l =>
        l.cities.map(val => ({
          ...val,
          countryCode: l.isoCode,
          countrySlug: l.slug,
          countryName: l.name
        }))
      );
      return cities;
    }
    return [];
  }, [locals]);

  const getRandomCities = useCallback(() => {
    const cities = getCities();
    return cities.sort(() => Math.random() - Math.random()).slice(0, 24);
  }, [getCities]);

  const getTopCities = useCallback(() => {
    const cities = getCities();
    return cities.sort((a, b) => b.teacherCount - a.teacherCount).slice(0, 32);
  }, [getCities]);

  const loadLocals = async () => {
    const resp = await Axios.get(
      'https://sitemap.insighttimer.com/json/locals.json'
    );

    const localArray: TLocal[] = [];
    const dataArray = Object.entries(resp.data);

    dataArray.map(d => localArray.push(convertLocal(d)));

    setLoading(false);
    setLocals(localArray);
  };

  const handleLoadLocals = useCallback(loadLocals, []);

  useEffect(() => {
    handleLoadLocals();
  }, [handleLoadLocals]);

  return { loading, locals, getCities, getRandomCities, getTopCities };
};

export default useLocals;
