import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  memberPlus: {
    left: '8px',
    top: '6px',
    [theme.breakpoints.down('xs')]: {
      top: '5px'
    },
    position: 'absolute',
    zIndex: 20
  },
  featuredLabel: {
    top: '16px',
    left: 0,
    width: 'auto',
    height: '41px',
    position: 'absolute',
    zIndex: 20
  },
  featuredPlaylistLabel: {
    top: '35px',
    left: '-6px',
    width: 'auto',
    height: '130px',
    position: 'absolute',
    zIndex: 20
  }
}));

export default useStyles;
