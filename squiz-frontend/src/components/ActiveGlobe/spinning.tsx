import styled from '@emotion/styled';
import { useGlobalStats } from 'hooks/useGlobalStats';
// import { geoOrthographic, geoPath } from 'd3-geo';
import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import geoUrl from './world-110m.json';

const StyledComposableMap = styled(ComposableMap)`
  width: 100%;
  height: 100vh;
  transition: all 0.1s;
`;

const SpinningGlobe: React.FC<{}> = () => {
  const [rotation, setRotation] = useState(0);
  const { activities_locations } = useGlobalStats();

  requestAnimationFrame(() => {
    setRotation(r => r + 0.1);
  });

  return (
    <StyledComposableMap
      projection="geoOrthographic"
      projectionConfig={{
        rotate: [rotation, 0, 0],
        scale: 150
      }}
    >
      <Geographies
        geography={geoUrl}
        fill="#D6D6DA"
        stroke="#FFFFFF"
        strokeWidth={0.5}
      >
        {({ geographies }) =>
          geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)
        }
      </Geographies>

      {activities_locations !== undefined &&
        activities_locations
          .filter(val => val.lon < -rotation + 90 && val.lon > -rotation - 90)
          .map((val: { lon: number; lat: number }) => (
            <Marker key={val.lon + val.lat} coordinates={[val.lon, val.lat]}>
              <circle r={1.5} fill="#181818" opacity={0.5} />
            </Marker>
          ))}
    </StyledComposableMap>
  );
};

export default SpinningGlobe;
