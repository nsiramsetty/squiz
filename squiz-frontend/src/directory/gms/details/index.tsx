/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PageMeta from 'components/PageMeta';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import { usePageViewTracker } from 'context/PageViewTracker';
import DirectorylistItem from 'directory/base/DirectorylistItem';
import FilterButton from 'directory/base/FilterButton';
import MeditationStyles from 'directory/gms/details/MeditationStyles';
import { PageTypes } from 'lib/mparticle/enums';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { DirectoryApi } from 'services/directory/api';

type PathParams = {
  meditationTopic?: string;
  startwith?: string;
  props?: any;
};

const directoryApi = new DirectoryApi();

const GmByTopicDirectory: FunctionComponent<RouteComponentProps<
  PathParams
>> = ({ match, history, location }) => {
  let topicDetails: any;
  const { meditationTopic } = match.params;
  const topicTitle = location.state ? location.state.name : meditationTopic;
  const { startwith } = match.params;
  let displayStartwith = match.params.startwith;
  let allGM: any = [];
  const [jsonData, setJsonData] = useState<any>();
  const [topicKeys, setTopicKeys] = useState<any>([]);
  const [topicData, setTopicData] = useState([]);
  const [filterTopicData, setFilterTopicData] = useState([]);
  const { trackPageView } = usePageViewTracker();

  // const jsonData = require(`../../files/gms_by_topic/${meditationTopic}.json`);
  let filterStart: any;

  useEffect(() => {
    if (jsonData) {
      for (const GMValue of Object.values(jsonData)) {
        allGM = allGM.concat(GMValue);
      }

      topicDetails = allGM
        .sort(() => Math.random() - Math.random())
        .slice(0, 100);

      if (match.params.startwith) {
        filterStart = match.params.startwith;
        if (filterStart === 'hash') {
          filterStart = '#';
        } else if (filterStart === 'more') {
          filterStart = 'other';
        }
        setFilterTopicData(jsonData[filterStart]);
      }

      topicDetails = topicDetails.sort((a: any, b: any) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      setTopicData(topicDetails);
      setTopicKeys(Object.keys(jsonData));
    }
  }, [jsonData, match.params.startwith]);

  useEffect(() => {
    directoryApi
      .getDirectoryGMSData(meditationTopic)
      .then(resp => {
        setJsonData(resp);
      })
      .catch(err => {
        console.log(err);
        setJsonData(null);
      });
  }, []);

  useEffect(() => {
    console.log(topicKeys);
  }, [topicKeys]);

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.GuidedMeditationDirectory,
      $og_title: `${topicTitle}`,
      $og_description: `${topicTitle}`,
      $og_image_url:
        'https://insighttimer.com/static/media/logo-bowl.8c14da94.png'
    });
  }, [trackPageView, topicTitle]);

  if (displayStartwith === 'hash') {
    displayStartwith = 'Numbers';
  } else if (displayStartwith === 'more') {
    displayStartwith = 'Others';
  }

  if (jsonData === null) return <PageNotFound />;
  return (
    <>
      <PageMeta
        title={topicTitle}
        description={topicTitle}
        url={`https://insighttimer.com/dir/guided-meditations/${meditationTopic}${
          startwith ? `/${startwith}` : ''
        }`}
      />
      {jsonData && (
        <MeditationStyles>
          <Grid container direction="row">
            <div className="meditation-title">
              <h1>
                Meditations for
                <span> {topicTitle} </span>
                {displayStartwith &&
                  ` starting with '${displayStartwith.toUpperCase()}'`}
              </h1>
            </div>

            <FilterButton
              startwith={startwith}
              filterKeys={topicKeys}
              baseLink={`/dir/guided-meditations/${meditationTopic}`}
            />

            {startwith && (
              <div className="meditation-block">
                <Grid container direction="row">
                  {filterTopicData &&
                    filterTopicData.map((item: any, index: number) => (
                      <DirectorylistItem
                        key={index}
                        linkTo={item.web_url}
                        title={item.name}
                      />
                    ))}
                  {!filterTopicData && startwith && <div>Nothing found.</div>}
                </Grid>
              </div>
            )}

            <div className="meditation-block">
              <h2 className="featured-title">Featured</h2>
              <Grid container direction="row">
                {topicData &&
                  topicData.map((item: any, index: number) => (
                    <DirectorylistItem
                      key={index}
                      linkTo={item.web_url}
                      title={item.name}
                    />
                  ))}
                {!topicData.length && <div>Nothing found.</div>}
              </Grid>
            </div>
          </Grid>
        </MeditationStyles>
      )}
      <Footer />
    </>
  );
};

export default GmByTopicDirectory;
