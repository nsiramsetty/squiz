import React from 'react';
import { Helmet } from 'react-helmet';

type TProps = {
  is404?: boolean;
};

const Header404: React.FC<TProps> = ({ is404 }) => {
  if (is404) {
    return (
      <Helmet>
        <meta name="prerender-status-code" content="404" />
      </Helmet>
    );
  }
  return <></>;
};

export default Header404;
