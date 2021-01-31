import Box from '@material-ui/core/Box';
import { ReactComponent as AppStoreIcon } from 'assets_2/icons/app-store-icon.svg';
import { ReactComponent as GooglePlayIcon } from 'assets_2/icons/play-store-icon.svg';
import useDownloadAppHandler from 'hooks/useDownloadAppHandler';
import React from 'react';
import { isAndroid, isIOS } from 'react-device-detect';
import { DownloadButton } from './styled';

const CircleDownloadButton: React.FC = () => {
  const downloadAppHandler = useDownloadAppHandler();

  if (isIOS) {
    return (
      <DownloadButton onClick={downloadAppHandler}>
        <Box marginRight="7px" marginBottom="5px">
          <AppStoreIcon fill="#fff" color="white" height="20px" />
        </Box>
        Continue with the app
      </DownloadButton>
    );
  }
  if (isAndroid) {
    return (
      <DownloadButton onClick={downloadAppHandler}>
        <Box marginRight="8px">
          <GooglePlayIcon width="21px" height="auto" />{' '}
        </Box>
        Continue with the app
      </DownloadButton>
    );
  }
  return (
    <DownloadButton onClick={downloadAppHandler}>Open the app</DownloadButton>
  );
};

export default CircleDownloadButton;
