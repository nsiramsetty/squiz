/* eslint-disable react-hooks/exhaustive-deps */
import Axios from 'axios';
import { Cities } from 'components/LocalCities';
import { convertLocal, TCity, TLocal } from 'hooks/useLocals';
import { useCallback, useEffect, useState } from 'react';

interface LooseObject {
  [key: string]: any;
}

const convertToCities = (countriesInfo: TLocal) =>
  countriesInfo.cities?.map((city: TCity) => ({
    ...city,
    countryCode: countriesInfo.isoCode,
    countrySlug: countriesInfo.slug,
    countryName: countriesInfo.name
  }));

const useLocalsByCountry = (
  countrySlug: string,
  limit: number,
  relatedCountry?: string[]
) => {
  const [cities, setCities] = useState<Cities[]>();
  const country = countrySlug.split('-').pop();

  const getTopCities = useCallback(
    (cities: Cities[], limit?: number) => {
      let numberOfCities = limit || 32;

      if (cities?.length >= numberOfCities) {
        return cities
          .sort((a, b) => b.teacherCount - a.teacherCount)
          .slice(0, numberOfCities);
      } else if (cities) {
        return cities.sort((a, b) => b.teacherCount - a.teacherCount);
      } else {
        return [];
      }
    },
    [country]
  );

  const loadLocalCitiesByCountry = async (
    country: string,
    relatedCountry?: string[]
  ) => {
    await Axios.get('https://sitemap.insighttimer.com/json/locals.json').then(
      resp => {
        const allCountries = resp.data;
        const localCountry = convertLocal([country, resp.data[country]]);
        let localCitiesInfo = getTopCities(convertToCities(localCountry));
        let allCities = localCitiesInfo;

        if (relatedCountry?.length) {
          relatedCountry.forEach(otherCountry => {
            const relatedLocalCountry = convertLocal([
              otherCountry,
              resp.data[otherCountry]
            ]);
            const relatedLocalCitiesInfo = getTopCities(
              convertToCities(relatedLocalCountry)
            );
            allCities = allCities.concat(relatedLocalCitiesInfo);
            localCitiesInfo = localCitiesInfo.concat(relatedLocalCitiesInfo);
            delete allCountries[otherCountry];
          });
        }
        if (localCitiesInfo.length < limit) {
          delete allCountries[country];
          const otherCountries = Object.entries(allCountries);
          const otherCountriesArray: TLocal[] = [];
          otherCountries.map(d => otherCountriesArray.push(convertLocal(d)));
          const otherCitiesInfo = getTopCities(
            otherCountriesArray.flatMap(otherCountries =>
              convertToCities(otherCountries)
            ),
            limit - localCitiesInfo.length
          );
          allCities = localCitiesInfo.concat(otherCitiesInfo);
        }
        setCities(allCities);
      }
    );
  };

  const handleLoadLocalCities = useCallback(loadLocalCitiesByCountry, [
    country,
    relatedCountry?.length
  ]);

  useEffect(() => {
    if (country) {
      handleLoadLocalCities(country, relatedCountry);
    }
  }, [handleLoadLocalCities]);

  return { cities };
};

export default useLocalsByCountry;
