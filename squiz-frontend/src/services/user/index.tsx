import { parseFullName } from 'parse-full-name';

export const getFirstName = (fullName: string) => {
  // If full name has prefix "The", return full name
  if (fullName.startsWith('The ')) return fullName;

  return parseFullName(fullName, 'first') || parseFullName(fullName, 'last');
};

export const getUserAvatarUrl = (
  userId: string,
  size: 'small' | 'medium' = 'small'
) => {
  return `${process.env
    .REACT_APP_PUBLISHER_IMAGE!}/${userId}%2Fpictures%2Fsquare_${size}.jpeg?alt=media`;
};

export default getFirstName;
