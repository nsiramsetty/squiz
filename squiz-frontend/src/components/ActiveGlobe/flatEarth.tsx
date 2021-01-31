import styled from '@emotion/styled';
import useLocals from 'hooks/useLocals';
import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import geoUrl from './world-110m.json';

const StyledComposableMap = styled(ComposableMap)`
  width: 100%;
  height: auto;
`;

const FlatEarth: React.FC<{}> = () => {
  const { loading, getCities } = useLocals();
  const cities = getCities();

  return (
    <>
      <StyledComposableMap
        height={580}
        width={630}
        projection="geoMercator"
        projectionConfig={{
          scale: 100
        }}
      >
        <Geographies
          geography={geoUrl}
          fill="#D6D6DA"
          stroke="#FFFFFF"
          strokeWidth={0.5}
        >
          {({ geographies }) =>
            geographies
              .filter(v => v.properties.REGION_UN !== 'Antarctica')
              .map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none'
                    },
                    hover: {
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none'
                    },
                    pressed: {
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none'
                    }
                  }}
                />
              ))
          }
        </Geographies>
        {cities.map(
          val =>
            val.lon &&
            val.lat &&
            val.name && (
              <Marker key={val.name} coordinates={[val.lon, val.lat]}>
                <a href={`/local/${val.countryCode}/${val.slug}`}>
                  <circle
                    r={3}
                    fill="rgb(25,121,121)"
                    stroke="#fff"
                    strokeWidth={1}
                    data-tip={`${val.name} - ${val.teacherCount} teachers`}
                    cursor="pointer"
                  />
                </a>
              </Marker>
            )
        )}
      </StyledComposableMap>

      {!loading && cities.length > 0 && (
        <ReactTooltip className="font-proxiRegular text-lg" />
      )}
    </>
  );
};

export default FlatEarth;
