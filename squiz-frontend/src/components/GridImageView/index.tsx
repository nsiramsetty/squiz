import React from 'react';
import useStyles from './styles';

const GridImageView: React.FC<{
  imageUrl: string;
  numberOfImages?: number;
}> = ({ imageUrl, numberOfImages }) => {
  const classes = useStyles();

  if (numberOfImages == null) return null;

  switch (numberOfImages) {
    case 3:
      return (
        <div className="absolute inset-0 flex flex-row">
          <GridImage
            className={classes.threeImagesLeftCol}
            imageUrl={imageUrl}
          />
          <div className={classes.threeImagesRightCol}>
            <GridImage
              className={classes.threeImagesRightTopRow}
              imageUrl={imageUrl}
            />
            <GridImage
              className={classes.threeImagesRightBottomRow}
              imageUrl={imageUrl}
            />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="absolute inset-0 flex flex-row">
          <GridImage className={classes.twoImagesLeftCol} imageUrl={imageUrl} />
          <GridImage
            className={classes.twoImagesRightCol}
            imageUrl={imageUrl}
          />
        </div>
      );
    case 1:
      return (
        <img
          src={imageUrl}
          alt="playlist cover"
          className="w-full absolute left-0 top-0 w-full"
        />
      );
    default:
      return null;
  }
};

const GridImage: React.FC<{
  className: string;
  imageUrl: string;
}> = ({ imageUrl, ...props }) => {
  return <div {...props} style={{ backgroundImage: `url(${imageUrl})` }} />;
};

export default GridImageView;
