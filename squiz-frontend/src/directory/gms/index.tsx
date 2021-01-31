import Grid from '@material-ui/core/Grid';
import PageMeta from 'components/PageMeta';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import { usePageViewTracker } from 'context/PageViewTracker';
import DirectorylistItem from 'directory/base/DirectorylistItem';
import MeditationTopicStyles from 'directory/gms/MeditationTopicStyles';
import { PageTypes } from 'lib/mparticle/enums';
import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { LibraryItemApi } from 'services/libraryItem/api';
import topics from '../../Assets/JsonFiles/topics.json';

type PathParams = {
  startwith?: string;
};

const libraryItemApi = new LibraryItemApi();

const GmDirectory: FC<RouteComponentProps<PathParams>> = ({ match }) => {
  const topicNameObject = [];
  const [guidedMeditation, setGuidedMeditation] = useState<any>();
  const { trackPageView } = usePageViewTracker();

  const { startwith } = match.params;

  const topicListData = topics.result.topic_groups;
  for (let index = 0; index < topicListData.length; index++) {
    const topicObject = topicListData[index].topics;

    for (let objectIndex = 0; objectIndex < topicObject.length; objectIndex++) {
      let element: any;
      element = topicObject[objectIndex];
      if (element.name) {
        if (
          topicNameObject
            .map(function(t) {
              return t.topic;
            })
            .indexOf(element.topic) === -1
        ) {
          topicNameObject.push({ topic: element.topic, name: element.name });
        }
      }
      if (element.children.length > 0) {
        const childData = element.children;
        for (let childIndex = 0; childIndex < childData.length; childIndex++) {
          const childElement = childData[childIndex];
          if (
            topicNameObject
              .map(function(t) {
                return t.topic;
              })
              .indexOf(childElement.topic) === -1
          ) {
            topicNameObject.push({
              topic: childElement.topic,
              name: childElement.name
            });
          }
        }
      }
    }
  }

  useEffect(() => {
    libraryItemApi
      .getLibraryItemsByFilter({}, 'most_played', 100, 0)
      .then(resp => {
        setGuidedMeditation(resp.data);
      })
      .catch(e => {
        setGuidedMeditation(null);
      });
  }, []);

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.GuidedMeditationDirectory,
      $og_title: `Guided Meditations Directory`,
      $og_description: `Guided Meditations Directory`,
      $og_image_url:
        'https://insighttimer.com/static/media/logo-bowl.8c14da94.png'
    });
  }, [trackPageView]);

  if (guidedMeditation === null && !topicNameObject) return <PageNotFound />;
  return (
    <>
      <PageMeta
        title="Guided Meditations Directory | Insight Timer"
        description="Guided Meditations Directory"
        url="https://insighttimer.com/dir/guided-meditations"
      />
      {topicNameObject && (
        <MeditationTopicStyles>
          <Grid container direction="row">
            <div className="meditation-title">
              <h1>Guided Meditations Directory</h1>
            </div>
            {guidedMeditation && (
              <div className="meditation-block">
                {!startwith && <h2 className="featured-title">Featured</h2>}
                <Grid container direction="row">
                  {guidedMeditation &&
                    guidedMeditation.map((item: any, index: number) => (
                      <DirectorylistItem
                        key={index}
                        linkTo={item.web_url}
                        title={item.title}
                      />
                    ))}
                  {!guidedMeditation.length && <div>Nothing found.</div>}
                </Grid>
              </div>
            )}
            {/* Topic List */}
            <div className="meditation-block">
              <h2 className="featured-title">Browse by Topics</h2>
              <Grid container direction="row">
                {topicNameObject &&
                  topicNameObject.map((item: any, index: number) => (
                    <DirectorylistItem
                      key={index}
                      linkTo={`/dir/guided-meditations/${item.topic}`}
                      title={item.name}
                    />
                  ))}
                {!topicNameObject.length && <div>Nothing found.</div>}
              </Grid>
            </div>
          </Grid>
        </MeditationTopicStyles>
      )}
      <Footer />
    </>
  );
};

export default GmDirectory;
