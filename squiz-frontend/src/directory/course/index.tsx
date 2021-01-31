import Grid from '@material-ui/core/Grid';
import PageMeta from 'components/PageMeta';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import { usePageViewTracker } from 'context/PageViewTracker';
import DirectorylistItem from 'directory/base/DirectorylistItem';
import CourseStyles from 'directory/course/CourseStyles';
import { PageTypes } from 'lib/mparticle/enums';
import React, { useEffect, useState } from 'react';
import { DirectoryApi } from 'services/directory/api';

const directoryApi = new DirectoryApi();

const CoursesDirectory = () => {
  const [CoursesDetails, setCoursesDetails] = useState<any>();
  const { trackPageView } = usePageViewTracker();

  useEffect(() => {
    directoryApi
      .getDirectoryData('courses')
      .then(resp => {
        setCoursesDetails(resp);
      })
      .catch(e => {
        setCoursesDetails(null);
      });
  }, []);

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.MeditationCoursesDirectory
    });
  }, [trackPageView]);

  if (CoursesDetails === null) return <PageNotFound />;
  return (
    <>
      <PageMeta
        title="Courses Directory | Insight Timer"
        description="Courses Directory"
        url="https://insighttimer.com/dir/meditation-courses"
      />
      {CoursesDetails && (
        <CourseStyles>
          <div className="course-title">
            <h1>Courses Directory</h1>
          </div>
          <Grid container direction="row">
            {CoursesDetails &&
              Object.entries(CoursesDetails).map(
                ([courseKey, courseValue]: any) => (
                  <div className="course-block" key={courseKey}>
                    <h2 className="featured-title">{courseKey}</h2>
                    {courseValue &&
                      courseValue.map((item: any, index: any) => (
                        <DirectorylistItem
                          key={index}
                          linkTo={item.web_url}
                          title={item.title}
                        />
                      ))}
                  </div>
                )
              )}
          </Grid>
        </CourseStyles>
      )}
      <Footer />
    </>
  );
};

export default CoursesDirectory;
