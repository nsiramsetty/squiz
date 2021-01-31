import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  threeImagesLeftCol: {
    flex: 3,
    marginRight: '0.25rem',
    backgroundSize: '135%',
    backgroundPosition: 'top center'
  },
  threeImagesRightCol: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column'
  },
  threeImagesRightTopRow: {
    flex: 1,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '0.25rem'
  },
  threeImagesRightBottomRow: {
    flex: 1,
    backgroundSize: 'cover',
    backgroundPosition: 'bottom'
  },
  twoImagesLeftCol: {
    flex: 1,
    marginRight: '0.25rem',
    backgroundSize: '165%',
    backgroundPosition: 'top center'
  },
  twoImagesRightCol: {
    flex: 1,
    backgroundSize: '165%',
    backgroundPosition: 'bottom center'
  }
}));

export default useStyles;
