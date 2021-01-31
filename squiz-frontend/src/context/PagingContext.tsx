import React from 'react';
import { PageTypes } from '../lib/mparticle/enums';

export interface PageAttributes {
  meta: {
    title: string;
    description?: string;
    page_url: string;
    image_url?: string;
    rel_url: string;
    next_url?: string;
    prev_url?: string;
    deeplink?: string;
  };

  ld_json?: string; // string for ldjson scripts

  mparticle?: {
    pageType: PageTypes;
    data?: any;
  };

  gtm?: any;

  branch?: any;
}

export const PagingContext = React.createContext<{ pageAttr?: PageAttributes }>(
  {
    pageAttr: undefined
  }
);
