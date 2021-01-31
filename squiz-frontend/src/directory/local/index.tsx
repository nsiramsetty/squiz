import Grid from '@material-ui/core/Grid';
import PageMeta from 'components/PageMeta';
import SectionContainer from 'components/SectionContainer';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import { usePageViewTracker } from 'context/PageViewTracker';
import DirectorylistItem from 'directory/base/DirectorylistItem';
import LocalStyles from 'directory/local/LocalStyles';
import useLocals from 'hooks/useLocals';
import { PageTypes } from 'lib/mparticle/enums';
import React, { useEffect } from 'react';

const LocalDirectory = () => {
  const { loading, locals } = useLocals();
  const { trackPageView } = usePageViewTracker();

  useEffect(() => {
    trackPageView({ pageType: PageTypes.LocalDirectory });
  }, [trackPageView]);

  if (!loading && !locals) return <PageNotFound />;
  return (
    <>
      <PageMeta
        title="Local Directory"
        description="Local Directory"
        url="https://insighttimer.com/dir/local"
      />
      <SectionContainer>
        {locals && (
          <LocalStyles>
            <div className="local-title">
              <h1>Countries & Cities Directory</h1>
            </div>
            <Grid container direction="row">
              {locals &&
                Object.entries(locals).map(([key, value]: any) => (
                  <Grid container>
                    <div className="local-block" key={key}>
                      <h2 className="featured-title">{value.name}</h2>
                      {value &&
                        value.cities.map((item: any, index: any) => (
                          <DirectorylistItem
                            key={index}
                            linkTo={`/local/${value.isoCode}/${item.slug}`}
                            title={item.name}
                          />
                        ))}
                    </div>
                  </Grid>
                ))}
              {/* {locals &&
              Object.entries(locals).map(
                ([key, value]: any) => (
                  <div className="local-block" key={key}>
                    <h2 className="featured-title">{value.name}</h2>
                    {value &&
                      value.cities.map((item: any, index: any) => (
                        <DirectorylistItem
                          key={index}
                          linkTo={`/local/${key}/${item.slug}`}
                          title={item.name}
                        />
                      ))}
                  </div>
                )
              )} */}
            </Grid>
          </LocalStyles>
        )}
      </SectionContainer>
      <Footer />
    </>
  );
};

export default LocalDirectory;
