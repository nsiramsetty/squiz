import locals from 'assets_2/static/locals.json';
import find from 'lodash/find';
import last from 'lodash/last';
import pickBy from 'lodash/pickBy';
import { useEffect, useState } from 'react';

const useLocalLink = (location?: string) => {
  const [link, setLink] = useState<string | undefined>();

  useEffect(() => {
    if (location && !link) {
      const locationArray = location.split(',');
      const lastLocation = last(locationArray) || '';
      let country = lastLocation.trimStart().trimEnd();
      const localsObject = JSON.parse(JSON.stringify(locals));

      if (country === 'USA' || country === 'US') country = 'United States';

      // Find country
      const localCountry = pickBy(localsObject, l => l.name === country);

      if (localCountry) {
        const localCountryCode = Object.keys(localCountry)[0];

        if (localCountryCode) {
          const { cities } = localCountry[localCountryCode];
          const city1 = locationArray[0];
          let city2 = '';

          // eslint-disable-next-line prefer-destructuring
          if (locationArray.length > 2) city2 = locationArray[1];

          // Find city
          const localCity = find(
            cities,
            l => city1.includes(l.name) || city2.includes(l.name)
          );

          if (localCity) {
            setLink(`/local/${localCountryCode}/${localCity.slug}`);
          }
        }
      }
    }
  }, [link, location]);

  return link;
};

export default useLocalLink;
