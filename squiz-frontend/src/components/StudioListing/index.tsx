import Grid from '@material-ui/core/Grid';
import SectionTitle from 'components/SectionTitle';
import VerticalSpacing from 'components/VerticalSpacing';
import React, { FC } from 'react';
import {
  StyledStudioInfo,
  StyledStudioLink,
  StyledStudioTitle
} from './styles';

interface TProps {
  title?: string;
  studios?: Studios[];
}

interface Studios {
  name: string;
  address: Address;
  contact: Contact;
}

interface Contact {
  phone: string;
  website: string;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

const StudioListing: FC<TProps> = ({ title, studios }) => {
  return (
    <>
      {title && (
        <>
          <SectionTitle>{title}</SectionTitle>
          <VerticalSpacing height={30} />
        </>
      )}
      {studios && (
        <Grid container spacing={3}>
          {studios.map((item: Studios) => (
            <Grid item sm={6} md={4} key={item.name + item.name}>
              <StyledStudioTitle>{item.name}</StyledStudioTitle>
              {item.address && (
                <StyledStudioInfo>
                  {[
                    item.address.line1,
                    item.address.line2,
                    item.address.city,
                    item.address.state,
                    item.address.postcode
                  ].join(', ')}
                </StyledStudioInfo>
              )}
              <div>
                <StyledStudioInfo>
                  {item.contact.phone &&
                    `Call ${item.contact.phone
                      .replace('(', '')
                      .replace(')', '')}, `}
                  {item.contact.website && (
                    <StyledStudioLink href={item.contact.website}>
                      {(item.contact.phone && 'website') || 'Website'}
                    </StyledStudioLink>
                  )}
                </StyledStudioInfo>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default StudioListing;
