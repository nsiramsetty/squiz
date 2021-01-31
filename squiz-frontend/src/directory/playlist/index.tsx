/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PageMeta from 'components/PageMeta';
import Footer from 'components_2/footer';
import PageNotFound from 'components_2/pageNotFound';
import { usePageViewTracker } from 'context/PageViewTracker';
import DirectorylistItem from 'directory/base/DirectorylistItem';
import FilterButton from 'directory/base/FilterButton';
import PlaylistStyles from 'directory/playlist/PlaylistStyles';
import { PageTypes } from 'lib/mparticle/enums';
import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { DirectoryApi } from 'services/directory/api';

type PathParams = {
  startwith?: any;
};

const directoryApi = new DirectoryApi();

const PlaylistsDirectory: FC<RouteComponentProps<PathParams>> = ({ match }) => {
  let { startwith } = match.params;
  let displayStartwith = match.params.startwith;
  let allPlaylists: any = [];
  const [PlaylistDetails, setPlaylistDetails] = useState<any>();
  const [playlistData, setPlaylistData] = useState([]);
  const [playlistKeys, setPlaylistKeys] = useState<any>([]);
  const [filterPlaylistData, setFilterPlaylistData] = useState([]);
  const { trackPageView } = usePageViewTracker();

  useEffect(() => {
    if (PlaylistDetails !== undefined && PlaylistDetails) {
      for (const techerValue of Object.values(PlaylistDetails)) {
        allPlaylists = allPlaylists.concat(techerValue);
      }
      if (allPlaylists) {
        setPlaylistData(
          allPlaylists.sort(() => Math.random() - Math.random()).slice(0, 100)
        );
      }

      if (startwith) {
        if (startwith === 'hash') {
          startwith = '#';
        } else if (startwith === 'more') {
          startwith = 'other';
        }
        setFilterPlaylistData(PlaylistDetails[startwith]);
      }

      setPlaylistKeys(Object.keys(PlaylistDetails));
    }
  }, [PlaylistDetails, startwith]);

  useEffect(() => {
    directoryApi
      .getDirectoryData('playlists')
      .then(resp => {
        setPlaylistDetails(resp);
      })
      .catch(e => {
        setPlaylistDetails(null);
      });
  }, []);

  useEffect(() => {
    trackPageView({
      pageType: PageTypes.PlaylistsDirectory
    });
  }, [trackPageView]);

  if (displayStartwith === 'hash') {
    displayStartwith = 'Numbers';
  } else if (displayStartwith === 'more') {
    displayStartwith = 'Others';
  }

  if (PlaylistDetails === null) return <PageNotFound />;
  return (
    <>
      <PageMeta
        title="Playlists Directory"
        description="Playlists Directory"
        url={`https://insighttimer.com/dir/playlists${
          startwith ? `/${startwith}` : ''
        }`}
      />
      {PlaylistDetails && (
        <PlaylistStyles>
          <Grid container direction="row">
            <div className="playlist-title">
              <h1>
                Playlists
                {(displayStartwith &&
                  ` starting with '${displayStartwith.toUpperCase()}'`) ||
                  ` Directory`}
              </h1>
            </div>
            <FilterButton
              startwith={startwith}
              filterKeys={playlistKeys}
              baseLink="/dir/playlists"
            />

            {startwith && (
              <div className="playlist-block">
                <Grid container direction="row">
                  {filterPlaylistData &&
                    filterPlaylistData.map((item: any, index: number) => (
                      <DirectorylistItem
                        key={index}
                        linkTo={`/meditation-playlists/${item.id}`}
                        title={item.name}
                      />
                    ))}
                  {!filterPlaylistData && startwith && (
                    <div>Nothing found.</div>
                  )}
                </Grid>
              </div>
            )}

            <div className="playlist-block">
              <h2 className="featured-title">Featured</h2>
              <Grid container direction="row">
                {playlistData &&
                  playlistData.map((item: any, index: number) => (
                    <DirectorylistItem
                      key={index}
                      linkTo={`/meditation-playlists/${item.id}`}
                      title={item.name}
                    />
                  ))}
                {playlistData === undefined && <div>Nothing found.</div>}
              </Grid>
            </div>
          </Grid>
        </PlaylistStyles>
      )}
      <Footer />
    </>
  );
};

export default PlaylistsDirectory;
