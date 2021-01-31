import styled from '@emotion/styled';
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useGlobalStats } from 'hooks/useGlobalStats';
import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import geoUrl from './world-110m.json';

interface Props {
  lat: number;
  lon: number;
  name: string;
}

const StyledComposableMap = styled(ComposableMap)`
  width: 100%;
  height: 100vh;
  transition: all 0.1s;
`;

const ActiveGlobe: React.FC<Props> = ({ lat, lon, name }) => {
  const [settings, setSettings] = useState({
    lt: 0,
    ln: 0,
    padding: 0.4 * window.innerHeight,
    zoom: 200,
    opacity: 1
  });
  const [scrollTop, setScrollTop] = useState(0);
  const offset = 0.5 * window.innerHeight;
  const maxZoom = 500;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const delayFactor = 2;
      const scrollDelay = scrollTop - offset > 0 ? scrollTop - offset : 0;
      setSettings({
        zoom: 200 + (maxZoom * scrollDelay) / delayFactor / offset,
        lt: -((lat * scrollTop) / delayFactor / offset),
        ln: -((lon * scrollTop) / delayFactor / offset),
        opacity:
          scrollTop > 1.5 * window.innerHeight
            ? 1 - (scrollTop - 1.5 * window.innerHeight) / window.innerHeight
            : 1,
        padding: -scrollTop + 0.4 * window.innerHeight
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [scrollTop, lat, lon, offset]);

  useEffect(() => {
    const onScroll = () => setScrollTop(document.documentElement.scrollTop);

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { activities_locations } = useGlobalStats();
  const xs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), {
    noSsr: true
  });

  return (
    <div
      style={{
        opacity: settings.opacity,
        display: settings.opacity < 0 ? 'none' : 'block',
        paddingTop: settings.padding > 60 ? settings.padding : 60
      }}
    >
      <StyledComposableMap
        height={xs ? 400 : 600}
        width={xs ? 533 : 800}
        projection="geoOrthographic"
        projectionConfig={{
          rotate: [
            Math.abs(settings.ln) < Math.abs(lon) ? settings.ln : -lon,
            Math.abs(settings.lt) < Math.abs(lat) ? settings.lt : -lat,
            0
          ],
          scale: settings.zoom < maxZoom ? settings.zoom : maxZoom
        }}
      >
        <Geographies
          geography={geoUrl}
          fill="#D6D6DA"
          // stroke="#FFFFFF"
          // strokeWidth={0.5}
        >
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>

        {activities_locations !== undefined &&
          activities_locations
            .filter(
              val =>
                val.lon < -settings.ln + 90 &&
                val.lon > -settings.ln - 90 &&
                val.lat < -settings.lt + 90 &&
                val.lat > -settings.lt - 90
            )
            .map((val: { lon: number; lat: number }) => (
              <Marker key={name} coordinates={[val.lon, val.lat]}>
                <circle r={1.5} fill="#181818" opacity={0.5} />
              </Marker>
            ))}

        <Marker key={name} coordinates={[lon, lat]}>
          <circle r={6} fill="rgb(25,121,121)" stroke="#fff" strokeWidth={2} />
          <text
            textAnchor="middle"
            y={-10}
            style={{
              fontFamily: 'ProximaNova',
              fill: '#181818'
            }}
          >
            {name}
          </text>
        </Marker>
      </StyledComposableMap>
    </div>
  );
};

export default ActiveGlobe;
