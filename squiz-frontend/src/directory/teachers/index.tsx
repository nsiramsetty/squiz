/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PageMeta from 'components/PageMeta';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import { usePageViewTracker } from 'context/PageViewTracker';
import DirectorylistItem from 'directory/base/DirectorylistItem';
import FilterButton from 'directory/base/FilterButton';
import TeacherStyles from 'directory/teachers/TeacherStyles';
import { PageTypes } from 'lib/mparticle/enums';
import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { DirectoryApi } from 'services/directory/api';

type PathParams = {
  startwith?: any;
};

const directoryApi = new DirectoryApi();

const TeachersDirectory: FC<RouteComponentProps<PathParams>> = ({ match }) => {
  let { startwith } = match.params;
  let displayStartwith = match.params.startwith;
  let allTeachers: any = [];
  const [TeacherDetails, setTeacherDetails] = useState<any>();
  const [teacherData, setTeacherData] = useState([]);
  const [teacherKeys, setTeacherKeys] = useState<any>([]);
  const { trackPageView } = usePageViewTracker();

  useEffect(() => {
    if (TeacherDetails && TeacherDetails !== undefined) {
      if (startwith) {
        if (startwith === 'hash') {
          startwith = '#';
        } else if (startwith === 'more') {
          startwith = 'other';
        }
        setTeacherData(TeacherDetails[startwith]);
      } else {
        for (const techerValue of Object.values(TeacherDetails)) {
          allTeachers = allTeachers.concat(techerValue);
        }
        if (allTeachers) {
          setTeacherData(
            allTeachers.sort(() => Math.random() - Math.random()).slice(0, 100)
          );
        }
      }
      setTeacherKeys(Object.keys(TeacherDetails));
    }
  }, [TeacherDetails, startwith]);

  useEffect(() => {
    directoryApi
      .getDirectoryData('teachers')
      .then(resp => {
        setTeacherDetails(resp);
      })
      .catch(e => {
        setTeacherDetails(null);
      });
  }, []);

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.MeditationTeachersDirectory
    });
  }, [trackPageView, match.params.startwith]);

  if (displayStartwith === 'hash') {
    displayStartwith = 'Numbers';
  } else if (displayStartwith === 'more') {
    displayStartwith = 'Others';
  }

  if (TeacherDetails === null) return <PageNotFound />;
  return (
    <>
      <PageMeta
        title="Teachers Directory | Insight Timer"
        description="Teachers Directory"
        url={`https://insighttimer.com/dir/meditation-teachers${
          startwith ? `/${startwith}` : ''
        }`}
      />
      {TeacherDetails && (
        <TeacherStyles>
          <Grid container direction="row">
            <div className="teacher-title">
              <h1>
                Teachers
                {(displayStartwith &&
                  ` starting with '${displayStartwith.toUpperCase()}'`) ||
                  ` Directory`}
              </h1>
            </div>

            <FilterButton
              startwith={startwith}
              filterKeys={teacherKeys}
              baseLink="/dir/meditation-teachers"
            />

            <div className="teacher-block">
              {!startwith && <h2 className="featured-title">Featured</h2>}
              <Grid container direction="row">
                {teacherData &&
                  teacherData.map((item: any, index: number) => (
                    <DirectorylistItem
                      key={index}
                      linkTo={`/${item.web_url}`}
                      title={item.name}
                    />
                  ))}
                {teacherData === undefined && <div>Nothing found.</div>}
              </Grid>
            </div>
          </Grid>
        </TeacherStyles>
      )}
      <Footer />
    </>
  );
};

export default TeachersDirectory;
