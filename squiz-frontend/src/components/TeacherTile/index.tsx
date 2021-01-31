// Material UI
import { Trans } from '@lingui/macro';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import moment from 'moment';
import React from 'react';
import {
  NewLabel,
  StyledContents,
  StyledImage,
  StyledLabel,
  StyledOverlay,
  StyledTeacherLocation,
  StyledTeacherName,
  TileContainer
} from './styled';
import TeacherButton from './TeacherButton';

type TProps = {
  to: string;
  id: string;
  name: string;
  location: string;
  createdAt?: number;
  lazyLoadInView: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const TeacherTile: React.SFC<TProps> = ({
  to,
  id,
  name,
  location,
  createdAt,
  onClick,
  lazyLoadInView
}) => {
  const i18n = useLinguiI18n();
  const teacherImage = `${process.env.REACT_APP_PUBLISHER_IMAGE}/${id}%2Fpictures%2Fsquare_medium.jpeg?alt=media`;

  const isNewPublisher = createdAt
    ? createdAt >
      moment()
        .subtract(2, 'months')
        .valueOf()
    : false;

  return (
    <div className="tile_background_image">
      <TeacherButton href={to} onClick={onClick}>
        <TileContainer className="image-container">
          {lazyLoadInView && (
            <StyledImage src={teacherImage} alt="library item cover" />
          )}

          <StyledOverlay load={lazyLoadInView} />

          {isNewPublisher ? (
            <NewLabel>
              <Trans>New</Trans>
            </NewLabel>
          ) : null}

          <StyledContents>
            <StyledLabel>
              {i18n.language === 'en' && <Trans>Teacher</Trans>}
            </StyledLabel>
            <StyledTeacherName>{name}</StyledTeacherName>
            <StyledTeacherLocation>
              {location
                .split(',')
                .slice(-1)[0]
                .trim()}
            </StyledTeacherLocation>
          </StyledContents>
        </TileContainer>
      </TeacherButton>
    </div>
  );
};

export default TeacherTile;
