/* eslint-disable react/no-unescaped-entities */
/* eslint-disable global-require */
import { Trans } from '@lingui/macro';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ReactComponent as ParentsSVG } from 'assets_2/images/kids/parents.svg';
import { ReactComponent as FreeSvg } from 'assets_2/images/library/free.svg';
import { useCommonStyles } from 'components_2/styles';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useGlobalStats } from 'hooks/useGlobalStats';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import {
  InteractionLocations,
  LinkClickedEventNames
} from 'lib/mparticle/enums';
import { logClicked } from 'lib/mparticle/loggers';
import numeral from 'numeral';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StandardNav from '../StandardNav';

const useStyles = makeStyles((theme: Theme) => ({
  leftContainer: {
    width: '40%',
    maxWidth: '550px',
    [theme.breakpoints.down(1500)]: {
      maxWidth: '400px'
    }
  },
  playlistContainer: {
    width: '30%',
    margin: '-12px 0'
  },
  topicsContainer: {
    width: '70%',
    margin: '-12px 0'
  },
  gridTile: {
    padding: '12px'
  },
  playlistsTile: {
    background: '#fff',
    border: 'solid 1px #e8e8e8',
    borderRadius: '7px',
    transition: 'transform 0.35s, box-shadow 0.25s linear',
    '&:hover': {
      background: '#fff',
      transform: 'translate(0px, -8px)',
      boxShadow: '0 10px 40px -10px rgba(24,24,24,0.5)'
    }
  },
  playlistsLabel: {
    paddingLeft: '20px',
    paddingTop: '10px',
    height: '50%'
  },
  kitTile: {
    width: '100%',
    paddingTop: '101%',
    borderRadius: '7px',
    transition: 'transform 0.35s, box-shadow 0.25s linear',
    '&:hover': {
      transform: 'translate(0px, -8px)',
      boxShadow: '0 10px 40px -10px rgba(24,24,24,0.5)'
    }
  },
  firstLabel: {
    fontSize: '28px !important',
    [theme.breakpoints.down(1500)]: {
      fontSize: '22px !important'
    }
  },
  secondLabel: {
    fontSize: '32px !important',
    [theme.breakpoints.down(1500)]: {
      fontSize: '25px !important'
    }
  },
  kidsLabel: {
    width: '70px',
    marginTop: '5px',
    height: 'auto',
    [theme.breakpoints.down(1500)]: {
      marginTop: '7px',
      width: '60px'
    }
  },
  free: {
    width: '80px',
    marginBottom: '-16px'
  },
  freeSvg: {
    width: '100%',
    height: '100%'
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%'
  },
  margins: {
    paddingLeft: '80px',
    paddingRight: '70px',
    paddingTop: '80px',
    paddingBottom: '80px',
    [theme.breakpoints.down(1500)]: {
      paddingLeft: '60px',
      paddingRight: '50px',
      paddingTop: '60px',
      paddingBottom: '60px'
    }
  },
  seeAllTile: {
    width: '100%',
    borderRadius: '7px',
    paddingTop: '12%',
    transition: 'transform 0.35s, box-shadow 0.25s linear',
    '&:hover': {
      background: '#fff',
      transform: 'translate(0, -8px)',
      boxShadow: '0 10px 40px -10px rgba(24,24,24,0.5)'
    },
    [theme.breakpoints.up(1681)]: {
      paddingTop: '104%'
    }
  },
  PopoverPaper: {
    fontSize: '15px',
    boxShadow: '0 9px 20px -2px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
    marginTop: '-10px'
  }
}));

// TODO: this need to be refactored
const LibraryNav: React.FC = () => {
  const [menuHovered, setMenuHovered] = useState(false);

  const classes = useStyles();
  const commonStyles = useCommonStyles();
  const gmTotal = useGlobalStats().free_guided_meditations || 40000;
  const gmTotalFormatted = numeral(gmTotal).format('0,0');
  const { pageType } = usePageViewTracker();
  const i18n = useLinguiI18n();

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFocus={() => {}}
      onMouseOver={() => setMenuHovered(true)}
      onMouseLeave={() => setMenuHovered(false)}
    >
      <StandardNav
        to="/"
        active={menuHovered}
        interactionLocation={InteractionLocations.Header}
      >
        <Trans>Meditation</Trans>
      </StandardNav>

      {menuHovered && (
        <div className="w-full left-0 absolute" style={{ paddingTop: '20px' }}>
          <div
            className={`${classes.PopoverPaper} rounded-lg mx-10 absolute w-auto left-0 right-0 `}
          >
            <div
              className={`${classes.margins} flex flex-row items-center z-50`}
            >
              <div className={classes.leftContainer}>
                <h3
                  className={`${commonStyles.page_title} font-ProxiBold leading-tight mr-5 pr-5 text-left`}
                  style={{ color: '#181818', fontSize: '42px' }}
                >
                  <Trans>
                    {gmTotalFormatted}{' '}
                    <span className={`${classes.free} inline-block `}>
                      <FreeSvg className={classes.freeSvg} />
                    </span>{' '}
                    guided meditations
                  </Trans>
                </h3>
                <p
                  className={`${commonStyles.page_copy} font-ProxiRegular opacity-75 text-xdark_ leading-normal mt-4 mr-10 mb-6 pr-12 text-xl`}
                  style={{ color: '#181818' }}
                >
                  <Trans>
                    We believe everyone deserves access to a free daily
                    meditation practice. Which is why we publish the world's
                    largest collection of free guided meditations, with over{' '}
                    {gmTotalFormatted} titles.
                  </Trans>
                </p>
                <div
                  className="mt-0 text-left"
                  style={{ color: '#191919', fontSize: '16px' }}
                >
                  <Link
                    onClick={e => {
                      setMenuHovered(false);
                      logClicked(
                        LinkClickedEventNames.NavigationLink,
                        pageType,
                        (e.target as HTMLElement).innerText,
                        InteractionLocations.Header,
                        {
                          to: '/meditation-topics',
                          lang: i18n.language
                        }
                      );
                    }}
                    className="no-underline text-left hover:border-black border-black25 border-b"
                    to="/meditation-topics"
                    style={{ borderColor: 'rgba(18,18,18,0.2)' }}
                  >
                    <Trans>
                      See all <b>200 Topics</b>
                    </Trans>
                  </Link>
                </div>
              </div>

              <div className="flex-1 flex">
                <Grid container className={classes.playlistContainer}>
                  <Grid item className={`${classes.gridTile} w-full h-full`}>
                    <Button
                      component={Link}
                      onClick={(e: React.MouseEvent) => {
                        setMenuHovered(false);
                        logClicked(
                          LinkClickedEventNames.NavigationLink,
                          pageType,
                          (e.target as HTMLElement).innerText,
                          InteractionLocations.Header,
                          {
                            to: '/meditation-playlists',
                            lang: i18n.language
                          }
                        );
                      }}
                      to="/meditation-playlists"
                      className={`${classes.playlistsTile} w-full h-full overflow-hidden`}
                    >
                      <img
                        className="absolute left-0 top-0 w-full"
                        src={require('assets_2/images/header/playlists-menu.png')}
                        alt=""
                      />

                      <div
                        className={`${classes.playlistsLabel} absolute left-0 bottom-0 flex items-center`}
                      >
                        <div>
                          <div
                            className={`${classes.firstLabel} font-JennaSue leading-none mb-2 text-xdark_ w-full`}
                          >
                            <Trans>Introducing</Trans>
                          </div>
                          <div
                            className={`${classes.secondLabel} font-ProxiBold leading-none tracking-tight text-xdark_ w-full`}
                          >
                            <Trans>Playlists</Trans>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </Grid>
                </Grid>

                <Grid container className={classes.topicsContainer}>
                  <Grid item className={`${classes.gridTile} w-1/3 `}>
                    <Button
                      component={Link}
                      onClick={(e: React.MouseEvent) => {
                        setMenuHovered(false);
                        logClicked(
                          LinkClickedEventNames.NavigationLink,
                          pageType,
                          (e.target as HTMLElement).innerText,
                          InteractionLocations.Header,
                          {
                            to: '/meditation-topics/sleep',
                            lang: i18n.language
                          }
                        );
                      }}
                      to="/meditation-topics/sleep"
                      className={`${classes.kitTile} bg-bottom bg-cover `}
                      style={{
                        background: `url(${require('assets_2/images/header/sleep-menu.jpg')})`
                      }}
                    >
                      <div className={classes.center}>
                        <div
                          className={`${classes.firstLabel} font-JennaSue leading-none mb-2 text-white w-full text-center`}
                        >
                          <Trans>Improve your</Trans>
                        </div>
                        <div
                          className={`${classes.secondLabel} font-ProxiBold leading-none tracking-tight text-white w-full text-center`}
                        >
                          <Trans>Sleep</Trans>
                        </div>
                      </div>
                    </Button>
                  </Grid>

                  <Grid item className={`${classes.gridTile} w-1/3 `}>
                    <Button
                      component={Link}
                      onClick={(e: React.MouseEvent) => {
                        setMenuHovered(false);
                        logClicked(
                          LinkClickedEventNames.NavigationLink,
                          pageType,
                          (e.target as HTMLElement).innerText,
                          InteractionLocations.Header,
                          {
                            to: '/meditation-topics/anxiety',
                            lang: i18n.language
                          }
                        );
                      }}
                      to="/meditation-topics/anxiety"
                      className={`${classes.kitTile} bg-center bg-cover`}
                      style={{
                        background: `url(${require('assets_2/images/header/anxiety-menu.jpg')})`
                      }}
                    >
                      <div className={classes.center}>
                        <div
                          className={`${classes.firstLabel} font-JennaSue leading-none mb-2 text-white w-full text-center`}
                        >
                          <Trans>Coping with</Trans>
                        </div>
                        <div
                          className={`${classes.secondLabel} font-ProxiBold leading-none tracking-tight text-white w-full text-center`}
                        >
                          <Trans>Anxiety</Trans>
                        </div>
                      </div>
                    </Button>
                  </Grid>

                  <Grid item className={`${classes.gridTile} w-1/3 `}>
                    <Button
                      component={Link}
                      onClick={(e: React.MouseEvent) => {
                        setMenuHovered(false);
                        logClicked(
                          LinkClickedEventNames.NavigationLink,
                          pageType,
                          (e.target as HTMLElement).innerText,
                          InteractionLocations.Header,
                          {
                            to: '/meditation-topics/stress',
                            lang: i18n.language
                          }
                        );
                      }}
                      to="/meditation-topics/stress"
                      className={`${classes.kitTile} bg-center bg-cover`}
                      style={{
                        background: `url(${require('assets_2/images/header/stress-menu.jpg')})`
                      }}
                    >
                      <div className={classes.center}>
                        <div
                          className={`${classes.firstLabel} font-JennaSue leading-none mb-2 text-white w-full text-center`}
                        >
                          <Trans>Managing</Trans>
                        </div>
                        <div
                          className={`${classes.secondLabel} font-ProxiBold leading-none tracking-tight text-white w-full text-center`}
                        >
                          <Trans>Stress</Trans>
                        </div>
                      </div>
                    </Button>
                  </Grid>

                  <Grid item className={`${classes.gridTile} w-1/3`}>
                    <Button
                      component={Link}
                      onClick={(e: React.MouseEvent) => {
                        setMenuHovered(false);
                        logClicked(
                          LinkClickedEventNames.NavigationLink,
                          pageType,
                          (e.target as HTMLElement).innerText,
                          InteractionLocations.Header,
                          {
                            to: '/meditation-timer',
                            lang: i18n.language
                          }
                        );
                      }}
                      to="/meditation-timer"
                      className={`${classes.kitTile} bg-center bg-cover`}
                      style={{
                        background: `url(${require('assets_2/images/header/timer-menu.jpg')})`
                      }}
                    >
                      <div className={classes.center}>
                        <div
                          className={`${classes.firstLabel} font-JennaSue leading-none mb-2 text-white w-full text-center whitespace-no-wrap`}
                        >
                          <Trans>Meditation with</Trans>
                        </div>
                        <div
                          className={`${classes.secondLabel} font-ProxiBold leading-none tracking-tight text-white w-full text-center`}
                        >
                          <Trans>Timer</Trans>
                        </div>
                      </div>
                    </Button>
                  </Grid>

                  <Grid item className={`${classes.gridTile} w-1/3 `}>
                    <Button
                      component={Link}
                      onClick={(e: React.MouseEvent) => {
                        setMenuHovered(false);
                        logClicked(
                          LinkClickedEventNames.NavigationLink,
                          pageType,
                          (e.target as HTMLElement).innerText,
                          InteractionLocations.Header,
                          {
                            to: '/meditation-music',
                            lang: i18n.language
                          }
                        );
                      }}
                      to="/meditation-music"
                      className={`${classes.kitTile} bg-center bg-cover`}
                      style={{
                        background: `url(${require('assets_2/images/header/music-menu.jpg')})`
                      }}
                    >
                      <div className={classes.center}>
                        <div
                          className={`${classes.firstLabel} font-JennaSue leading-none mb-2 text-white w-full text-center`}
                        >
                          <Trans>Unwind with</Trans>
                        </div>
                        <div
                          className={`${classes.secondLabel} font-ProxiBold leading-none tracking-tight text-white w-full text-center`}
                        >
                          <Trans>Music</Trans>
                        </div>
                      </div>
                    </Button>
                  </Grid>

                  <Grid item className={`${classes.gridTile} w-1/3 `}>
                    <Button
                      component={Link}
                      onClick={(e: React.MouseEvent) => {
                        setMenuHovered(false);
                        logClicked(
                          LinkClickedEventNames.NavigationLink,
                          pageType,
                          (e.target as HTMLElement).innerText,
                          InteractionLocations.Header,
                          {
                            to: '/meditation-topics/children',
                            lang: i18n.language
                          }
                        );
                      }}
                      to="/meditation-topics/children"
                      className={`${classes.kitTile} bg-center bg-cover`}
                      style={{
                        background: `url(${require('assets_2/images/header/kids-menu.jpg')})`
                      }}
                    >
                      <div className={classes.center}>
                        <div
                          className={`${classes.firstLabel} font-JennaSue leading-none text-white w-full text-center`}
                        >
                          <Trans>Meditation for</Trans>
                        </div>
                        <ParentsSVG
                          className={`${classes.kidsLabel} mx-auto`}
                        />
                      </div>
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryNav;
