import { Plural, Trans } from '@lingui/macro';
import Grid from '@material-ui/core/Grid';
import SectionTitle from 'components/SectionTitle';
import VerticalSpacing from 'components/VerticalSpacing';
import React, { FC, ReactElement } from 'react';
import { StyledLink, StyledMeditators } from './styles';

export interface Cities {
  name: string;
  slug: string;
  countryName: string;
  countrySlug: string;
  countryCode: string;
  teacherCount: number;
  userCount: number;
}

interface TProps {
  title?: string | ReactElement;
  cities: Cities[];
}

const LocalCities: FC<TProps> = ({ title, cities }) => {
  return (
    <>
      {title && (
        <>
          <SectionTitle>{title}</SectionTitle>
          <VerticalSpacing height={30} />
        </>
      )}
      <Grid container spacing={1}>
        {cities.map(item => (
          <Grid item xs={6} md={4} lg={3} key={item.countryCode + item.name}>
            <StyledLink href={`/local/${item.countryCode}/${item.slug}`}>
              <Trans id={item.name} />, <Trans id={item.countryName} />
              <StyledMeditators>
                {item.teacherCount && (
                  <Plural
                    value={item.teacherCount.toLocaleString()}
                    one="# teacher"
                    other="# teachers"
                  />
                )}
              </StyledMeditators>
            </StyledLink>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default LocalCities;
