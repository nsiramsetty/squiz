import React from 'react';
import { Helmet } from 'react-helmet';

type TProps = {
  isNoindex?: boolean;
};

const NoIndexHeader: React.FC<TProps> = ({ isNoindex }) => {
  if (isNoindex) {
    return (
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
    );
  }
  return <></>;
};
export default NoIndexHeader;
