export const getUserImageUrl = (
  id: string,
  orientation: 'rectangle' | 'square',
  size: 'small' | 'medium' | 'large'
) => {
  return `https://users.insighttimer-api.net/${id}%2Fpictures%2F${orientation}_${size}.jpeg`;
};

export const getLibraryItemImageUrl = (
  id: string,
  orientation: 'rectangle' | 'square',
  size: 'small' | 'medium' | 'large' | 'xlarge'
) => {
  return `https://libraryitems.insighttimer-api.net/${id}%2Fpictures%2Ftiny_${orientation}_${size}.jpeg`;
};

export const getLibraryItemPreviewAudioUrl = (id: string) => {
  return `https://libraryaudio.insighttimer.com/${id}%2Faudio%2Fpreview.mp3?alt=media`;
};
