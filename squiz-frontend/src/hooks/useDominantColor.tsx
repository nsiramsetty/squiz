import FastAverageColor from 'fast-average-color';
import imageExists from 'image-exists';
import { useCallback, useEffect, useMemo, useState } from 'react';

const fac = new FastAverageColor();

function greyScale(rgb: number[]) {
  const grey = 0.2989 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  return grey;
}

const useDominantColor = (imageUrl?: string) => {
  const [dominantColor, setDominantColor] = useState<IFastAverageColorResult>();
  const publisherImage = useMemo(() => new Image(), []);

  const callback = useCallback(e => {
    fac
      .getColorAsync(e.target, {
        algorithm: 'dominant',
        mode: 'speed',
        left: 0,
        top: 0,
        height: 100,
        width: 100
      })
      .then(res => {
        res.isLight = 255 - greyScale(res.value) < 50;
        setDominantColor(res);
      });
  }, []);

  useEffect(() => {
    if (imageUrl) {
      imageExists(imageUrl, function(exists: boolean) {
        publisherImage.addEventListener('load', callback);
        publisherImage.crossOrigin = '*';
        publisherImage.src = imageUrl || '';
        return () => {
          publisherImage.removeEventListener('load', callback);
        };
      });
    }
  }, [imageUrl, callback, publisherImage]);

  const dc = dominantColor?.value;

  if (
    dc &&
    dominantColor &&
    dominantColor.isLight &&
    dc[0] > 244 &&
    dc[1] > 244 &&
    dc[2] > 244
  )
    return {
      isLightBackground: true,
      dominantColor: [244, 244, 244]
    };

  return {
    isLightBackground: dominantColor?.isLight,
    dominantColor: dc || [200, 200, 200]
  };
};

export default useDominantColor;
