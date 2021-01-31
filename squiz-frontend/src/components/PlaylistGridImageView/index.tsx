import FeaturedPlaylistFlag from 'assets_2/icons/playlists/featured-flag.svg';
import React, { useEffect, useState } from 'react';
import GridImageView from '../GridImageView';
import useStyles from './styles';

interface Props {
  playlistId: string;
  size: 'medium' | 'large';
  showFeaturedLabel?: boolean;
}

const PlaylistGridImageView: React.FC<Props> = ({
  playlistId,
  showFeaturedLabel,
  size
}) => {
  const classes = useStyles();
  const montageImageUrl = `${process.env.REACT_APP_PLAYLIST_IMAGE}/${playlistId}%2Fpictures%2Fmontage_${size}.jpeg?alt=media`;
  const [numberOfImages, setNumberOfImages] = useState<number>();

  useEffect(() => {
    const montageImage = new Image();
    const onImageLoaded = () => {
      const { width, height } = montageImage;
      const images = Math.floor(height / width);
      setNumberOfImages(images);
    };
    montageImage.addEventListener('load', onImageLoaded);
    montageImage.crossOrigin = '*';
    montageImage.src = montageImageUrl;
    return () => {
      montageImage.removeEventListener('load', onImageLoaded);
    };
  }, [montageImageUrl]);

  return (
    <>
      {showFeaturedLabel && (
        <img
          src={FeaturedPlaylistFlag}
          alt="featured"
          className={classes.featuredLabel}
        />
      )}

      <GridImageView
        numberOfImages={numberOfImages}
        imageUrl={montageImageUrl}
      />
    </>
  );
};

export default PlaylistGridImageView;
