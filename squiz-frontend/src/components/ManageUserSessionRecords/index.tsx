import VerticalSpacing from 'components/VerticalSpacing';
import { TRecord } from 'hooks/useUserSessions';
import moment from 'moment';
import React from 'react';
import {
  ContainedButton,
  StyledContainer,
  Table,
  TColumn,
  TLoader,
  TRow,
  TTitle
} from './styled';

interface TProps {
  records: TRecord[];
  loadingStatus?: string;
  showMoreRecords: boolean;
  getMoreRecords: () => void;
}

const ManageUserSesssionRecords: React.FC<TProps> = ({
  records,
  loadingStatus,
  showMoreRecords,
  getMoreRecords
}) => {
  const renderLoader = () => {
    return (
      <Table>
        <TRow noBorder>
          <TColumn>
            <TLoader width="60%" />
          </TColumn>
          <TColumn>
            <TLoader width="50%" />
          </TColumn>
          <TColumn>
            <TLoader width="70%" />
          </TColumn>
          <TColumn>
            <TLoader width="70%" />
          </TColumn>
        </TRow>
      </Table>
    );
  };

  const renderRecords = () => {
    return records.map(r => {
      return (
        <TRow key={r.startedAt}>
          <TColumn data-label="Started at :">
            {moment(r.startedAt).format('MMM DD YYYY hh:mm A')}
          </TColumn>
          <TColumn data-label="Duration (minutes) :">
            {moment()
              .startOf('day')
              .seconds(r.duration)
              .format('mm:ss')}
          </TColumn>
          <TColumn data-label="Activity :">{r.activity}</TColumn>
          <TColumn data-label="Preset :">{r.preset || '-'}</TColumn>
        </TRow>
      );
    });
  };

  if (loadingStatus === 'first') {
    return <StyledContainer>{renderLoader()}</StyledContainer>;
  }

  return (
    <StyledContainer>
      <TTitle>
        {records.length} record{records.length > 0 && 's'}
      </TTitle>

      <Table>
        <TRow>
          <TColumn head>Started at</TColumn>
          <TColumn head>Duration (minutes)</TColumn>
          <TColumn head>Activity</TColumn>
          <TColumn head>Preset</TColumn>
        </TRow>

        {renderRecords()}
      </Table>

      <VerticalSpacing
        height={[loadingStatus === 'more' ? 0 : 25, 25, 25, 25]}
      />

      {loadingStatus === 'more' && renderLoader()}

      {loadingStatus !== 'more' && showMoreRecords && (
        <ContainedButton onClick={getMoreRecords}>Load more</ContainedButton>
      )}
    </StyledContainer>
  );
};

export default ManageUserSesssionRecords;
