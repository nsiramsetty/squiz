import React from 'react';
import { Helmet } from 'react-helmet';

const AddMetaDescription: React.FC = ({ children }) => {
  return (
    <Helmet>
      <meta property="fb:app_id" content="157891377582896" />
      <meta name="twitter:card" content="app" />
      <meta name="twitter:app:name:iphone" content="Insight Timer" />
      <meta name="twitter:app:id:iphone" content="337472899" />
      <meta name="twitter:app:name:ipad" content="Insight Timer" />
      <meta name="twitter:app:id:ipad" content="365641524" />
      <meta name="twitter:app:name:googleplay" content="Insight Timer" />
      <meta
        name="twitter:app:id:googleplay"
        content="com.spotlightsix.zentimerlite2"
      />
      <meta name="author" content="Insight Network, Inc." />
      <meta
        name="copyright"
        content={`Insight Network, Inc. Copyright (c) ${new Date().getFullYear()}`}
      />
      {children}
    </Helmet>
  );
};

export default AddMetaDescription;
