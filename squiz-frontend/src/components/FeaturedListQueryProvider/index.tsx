import {
  FeaturedListQueryHook,
  useFeaturedListQuery
} from 'hooks/queries/useFeaturedListQuery';
import React, { ReactNode } from 'react';

type TProps = {
  children: (featuredList: FeaturedListQueryHook) => ReactNode;
  entryPoint: string;
  lang?: string;
};

const FeaturedListCarouselProvider: React.FC<TProps> = ({
  children,
  entryPoint,
  lang
}) => {
  const featuredList = useFeaturedListQuery(entryPoint, lang);

  return <> {children(featuredList)}</>;
};

export default FeaturedListCarouselProvider;
