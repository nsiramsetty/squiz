import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';
import { ReactComponent as MoreIcon } from 'assets_2/icons/playlists/more.svg';
import { ReactComponent as ShareIcon } from 'assets_2/icons/playlists/player/share.svg';
import { useSharePopup } from 'hooks/useSharePopup';
import React from 'react';

interface ShareButtonStyleProps {
  background?: string;
}

const SharingButton = styled(IconButton)<ShareButtonStyleProps>`
  height: 2.5rem;
  width: 2.5rem;
  outline: 0 !important;
  background-color: ${(props: ShareButtonStyleProps) =>
    props.background ? props.background : 'rgba(255, 255, 255, 1)'};
  z-index: 10;
  transition: 0.5s;
  :hover {
    background-color: ${(props: ShareButtonStyleProps) =>
      !props.background && 'rgba(255, 255, 255, 0.75)'};
    transform: translate(0, -5%);
  }
`;

interface Props {
  url: string;
  message: string;
  background?: string;
  showMoreIconInMobile?: boolean;
}

const ShareButton: React.FC<Props> = ({
  url,
  message,
  background,
  showMoreIconInMobile
}) => {
  const { showSharePopup } = useSharePopup();

  /* eslint-disable @typescript-eslint/no-unused-vars */
  return (
    <>
      <SharingButton
        background={background}
        onClick={e => {
          showSharePopup(url, message);
        }}
      >
        {showMoreIconInMobile ? <MoreIcon /> : <ShareIcon />}
      </SharingButton>
    </>
  );
};

export default ShareButton;
